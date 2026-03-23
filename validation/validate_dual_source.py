from datetime import date, datetime
from pathlib import Path
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request

import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
REPO_DIR = BASE_DIR.parent
LEGACY_VALIDATION_DIR = REPO_DIR.parent / "survey_validation"

EXCEL_NAME_REGEX = r"^被试验证_数据详情表_.*\.xlsx$"
OUTPUT_PATH = BASE_DIR / "validation_result.xlsx"
EXCEL_SEARCH_DIRS = [BASE_DIR, LEGACY_VALIDATION_DIR]
SERVICE_ACCOUNT_KEY_CANDIDATES = [
    BASE_DIR / "serviceAccountKey.json",
    LEGACY_VALIDATION_DIR / "serviceAccountKey.json",
    REPO_DIR / "serviceAccountKey.json",
    REPO_DIR.parent / "serviceAccountKey.json",
]
DURATION_THRESHOLD_MINUTES = 5


def parse_env_file(env_path: Path):
    values = {}
    if not env_path.exists():
        return values

    for line in env_path.read_text(encoding="utf-8").splitlines():
        raw = line.strip()
        if not raw or raw.startswith("#") or "=" not in raw:
            continue
        key, value = raw.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def load_env_values():
    merged = {}
    for path in [REPO_DIR / ".env", REPO_DIR / ".env.local"]:
        merged.update(parse_env_file(path))

    # Shell env overrides file values.
    merged.update({
        "VITE_SUPABASE_URL": os.getenv("VITE_SUPABASE_URL", merged.get("VITE_SUPABASE_URL", "")),
        "VITE_SUPABASE_TABLE": os.getenv("VITE_SUPABASE_TABLE", merged.get("VITE_SUPABASE_TABLE", "survey_responses")),
        "SUPABASE_SERVICE_ROLE_KEY": os.getenv("SUPABASE_SERVICE_ROLE_KEY", merged.get("SUPABASE_SERVICE_ROLE_KEY", "")),
        "SUPABASE_SERVICE_KEY": os.getenv("SUPABASE_SERVICE_KEY", merged.get("SUPABASE_SERVICE_KEY", "")),
        "VITE_SUPABASE_ANON_KEY": os.getenv("VITE_SUPABASE_ANON_KEY", merged.get("VITE_SUPABASE_ANON_KEY", "")),
        "VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY": os.getenv(
            "VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
            merged.get("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY", ""),
        ),
    })
    return merged


def normalize_header(text):
    return re.sub(r"\s+", "", str(text or ""))


def find_column(columns, required_keywords):
    required_keywords = [str(k).lower() for k in required_keywords]
    for col in columns:
        normalized = normalize_header(col).lower()
        if all(keyword in normalized for keyword in required_keywords):
            return col
    return None


def find_latest_excel_file():
    pattern = re.compile(EXCEL_NAME_REGEX)
    candidates = []

    for directory in EXCEL_SEARCH_DIRS:
        if not directory.exists():
            continue
        candidates.extend([
            p for p in directory.iterdir()
            if p.is_file() and pattern.match(p.name)
        ])

    if not candidates:
        return None
    return max(candidates, key=lambda p: p.stat().st_mtime)


def resolve_service_key():
    for path in SERVICE_ACCOUNT_KEY_CANDIDATES:
        if path.exists():
            return path
    return None


def normalize_uuid(value):
    return str(value or "").replace("\u200b", "").strip()


def normalize_birth(value):
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return ""

    if isinstance(value, datetime):
        return value.strftime("%Y-%m-%d")
    if isinstance(value, date):
        return value.strftime("%Y-%m-%d")

    text = str(value).strip().replace("/", "-")
    if not text:
        return ""

    parsed = pd.to_datetime(text, errors="coerce")
    if pd.notna(parsed):
        return parsed.strftime("%Y-%m-%d")

    return text.split(" ")[0]


def normalize_gender(value):
    text = str(value or "").strip().lower()
    mapping = {
        "男": "male",
        "male": "male",
        "女": "female",
        "female": "female",
        "其他": "other",
        "other": "other",
    }
    return mapping.get(text, text)


def parse_duration_seconds(value):
    if value is None:
        return 0

    if isinstance(value, (int, float)) and not pd.isna(value):
        return int(value)

    text = str(value).strip().lower()
    if not text:
        return 0

    zh_match = re.search(r"(\d+)分(\d+)秒", text)
    if zh_match:
        return int(zh_match.group(1)) * 60 + int(zh_match.group(2))

    sec_match = re.search(r"(\d+)\s*s", text)
    if sec_match:
        return int(sec_match.group(1))

    hhmmss_match = re.match(r"^(\d+):(\d+)(?::(\d+))?$", text)
    if hhmmss_match:
        if hhmmss_match.group(3) is None:
            mm = int(hhmmss_match.group(1))
            ss = int(hhmmss_match.group(2))
            return mm * 60 + ss
        hh = int(hhmmss_match.group(1))
        mm = int(hhmmss_match.group(2))
        ss = int(hhmmss_match.group(3))
        return hh * 3600 + mm * 60 + ss

    return 0


def fetch_firebase_data():
    key_path = resolve_service_key()
    if key_path is None:
        print("Warning: serviceAccountKey.json not found, skip Firebase source.")
        return {}

    if not firebase_admin._apps:
        cred = credentials.Certificate(str(key_path))
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    try:
        docs = db.collection("surveyResponses").stream()

        data = {}
        for doc_item in docs:
            payload = doc_item.to_dict() or {}
            data[normalize_uuid(payload.get("uuid") or doc_item.id)] = {
                "source": "firebase",
                "payload": payload,
            }
        return data
    except Exception as exc:
        print(f"Warning: Firebase request failed ({exc}), skip Firebase source.")
        return {}


def fetch_supabase_data():
    env = load_env_values()
    supabase_url = str(env.get("VITE_SUPABASE_URL") or "").strip()
    supabase_table = str(env.get("VITE_SUPABASE_TABLE") or "survey_responses").strip()
    supabase_key = (
        str(env.get("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
        or str(env.get("SUPABASE_SERVICE_KEY") or "").strip()
        or str(env.get("VITE_SUPABASE_ANON_KEY") or "").strip()
        or str(env.get("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY") or "").strip()
    )

    using_service_key = bool(
        str(env.get("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
        or str(env.get("SUPABASE_SERVICE_KEY") or "").strip()
    )

    if not supabase_url or not supabase_key:
        print("Warning: Supabase env not configured, skip Supabase source.")
        return {}

    if not using_service_key:
        print(
            "Warning: Supabase read is using anon/publishable key. "
            "With strict RLS this often returns empty results; "
            "set SUPABASE_SERVICE_ROLE_KEY for validation reads."
        )

    endpoint = (
        f"{supabase_url.rstrip('/')}/rest/v1/{urllib.parse.quote(supabase_table)}"
        "?select=*"
        "&limit=100000"
    )

    request = urllib.request.Request(
        endpoint,
        method="GET",
        headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Accept": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = ""
        try:
            detail = exc.read().decode("utf-8", errors="ignore").strip()
        except Exception:
            detail = ""
        if detail:
            print(f"Warning: Supabase HTTP error {exc.code}, detail: {detail}")
        else:
            print(f"Warning: Supabase HTTP error {exc.code}, skip Supabase source.")
        return {}
    except Exception as exc:
        print(f"Warning: Supabase request failed ({exc}), skip Supabase source.")
        return {}

    mapped = {}
    for row in data if isinstance(data, list) else []:
        uuid_value = normalize_uuid(row.get("uuid"))
        if not uuid_value:
            continue
        mapped[uuid_value] = {
            "source": "supabase",
            "payload": row,
        }
    return mapped


def extract_birth_gender_duration(record):
    payload = record.get("payload") or {}
    answers = payload.get("answers") or {}
    if isinstance(answers, str):
        try:
            answers = json.loads(answers)
        except Exception:
            answers = {}

    birth = normalize_birth(answers.get("birth_date"))
    gender = normalize_gender(answers.get("gender"))
    duration = parse_duration_seconds(
        payload.get("duration")
        or payload.get("duration_secs")
        or payload.get("durationSec")
    )

    return birth, gender, duration


def build_merged_records(supabase_data, firebase_data):
    merged = {}

    # Supabase is primary source.
    for uuid_value, record in firebase_data.items():
        merged[uuid_value] = record
    for uuid_value, record in supabase_data.items():
        merged[uuid_value] = record

    return merged


def main():
    excel_path = find_latest_excel_file()
    if excel_path is None:
        print(f"Error: no Excel file matched regex: {EXCEL_NAME_REGEX}")
        return

    print(f"Using latest excel file: {excel_path}")

    try:
        df = pd.read_excel(excel_path)
    except Exception as exc:
        print(f"Error reading Excel: {exc}")
        return

    uuid_col = find_column(df.columns, ["唯一id"])
    birth_col = find_column(df.columns, ["出生日期"])
    gender_col = find_column(df.columns, ["性别"])
    duration_col = find_column(df.columns, ["答题时长"])

    missing_cols = [
        name for name, col in [
            ("UUID", uuid_col),
            ("Birth Date", birth_col),
            ("Gender", gender_col),
            ("Duration", duration_col),
        ] if col is None
    ]
    if missing_cols:
        print(f"Error: missing required columns in Excel: {missing_cols}")
        print(f"Detected columns: {list(df.columns)}")
        return

    print("Fetching Firebase and Supabase data ...")
    firebase_data = fetch_firebase_data()
    supabase_data = fetch_supabase_data()
    merged_data = build_merged_records(supabase_data, firebase_data)

    print(f"Fetched records: firebase={len(firebase_data)}, supabase={len(supabase_data)}, merged={len(merged_data)}")

    results = []
    threshold_seconds = DURATION_THRESHOLD_MINUTES * 60

    for _, row in df.iterrows():
        excel_uuid = normalize_uuid(row[uuid_col])
        excel_birth = normalize_birth(row[birth_col])
        excel_gender = normalize_gender(row[gender_col])
        excel_duration_seconds = parse_duration_seconds(row[duration_col])

        notes = []
        status = "Valid"
        source = "not-found"

        fb_birth = ""
        fb_gender = ""
        fb_duration_seconds = 0

        merged_record = merged_data.get(excel_uuid)
        if not merged_record:
            status = "Abnormal"
            notes.append("UUID not found in Supabase/Firebase")
        else:
            source = merged_record.get("source") or "unknown"
            fb_birth, fb_gender, fb_duration_seconds = extract_birth_gender_duration(merged_record)

            if fb_birth != excel_birth:
                status = "Abnormal"
                notes.append(f"Birthdate mismatch (Excel: {excel_birth}, DB: {fb_birth})")

            if fb_gender != excel_gender:
                status = "Abnormal"
                notes.append(f"Gender mismatch (Excel: {excel_gender}, DB: {fb_gender})")

            if fb_duration_seconds < threshold_seconds:
                status = "Abnormal"
                notes.append(
                    f"Duration too short ({fb_duration_seconds}s < {threshold_seconds}s)"
                )

        results.append({
            "UUID": excel_uuid,
            "Validation_Status": status,
            "Validation_Notes": "; ".join(notes),
            "Matched_Source": source,
            "Excel_Birth": excel_birth,
            "DB_Birth": fb_birth,
            "Excel_Gender": excel_gender,
            "DB_Gender": fb_gender,
            "Excel_Duration_Sec": excel_duration_seconds,
            "DB_Duration_Sec": fb_duration_seconds,
        })

    result_df = pd.DataFrame(results)
    merged = df.merge(result_df, left_on=uuid_col, right_on="UUID", how="left")

    try:
        merged.to_excel(OUTPUT_PATH, index=False)
        abnormal_count = int((result_df["Validation_Status"] == "Abnormal").sum())
        print(f"Validation complete. Output: {OUTPUT_PATH}")
        print(f"Total rows: {len(result_df)}, abnormal rows: {abnormal_count}")
    except Exception as exc:
        print(f"Error saving result: {exc}")


if __name__ == "__main__":
    main()
