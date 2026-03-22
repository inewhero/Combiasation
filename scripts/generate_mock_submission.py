import argparse
import json
import random
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import firebase_admin
from firebase_admin import credentials, firestore

BASE_DIR = Path(__file__).resolve().parent
SERVICE_ACCOUNT_KEY_CANDIDATES = [
    BASE_DIR / "serviceAccountKey.json",
    BASE_DIR.parent / "serviceAccountKey.json",
    BASE_DIR.parent.parent / "serviceAccountKey.json",
    BASE_DIR.parent.parent / "survey_validation" / "serviceAccountKey.json",
]

COUNTRIES_ZH = [
    "中国", "美国", "日本", "德国", "法国", "印度", "俄罗斯", "巴西", "加拿大", "英国",
]
COUNTRIES_EN = [
    "China", "the United States", "Japan", "Germany", "France", "India", "Russia", "Brazil", "Canada", "the United Kingdom",
]
FOLLOWUP_OPTIONS_ZH = [
    "地理位置", "气候条件", "历史背景", "语言文化", "经济结构", "政治体系", "科技水平", "社会组成", "国际关系", "生活方式",
]
FOLLOWUP_OPTIONS_EN = [
    "Geographical Location", "Climate Conditions", "Historical Background", "Language and Culture", "Economic Structure", "Political System", "Level of Technology", "Social Composition", "International Relations", "Lifestyle",
]


def resolve_service_key() -> Path:
    for path in SERVICE_ACCOUNT_KEY_CANDIDATES:
        if path.exists():
            return path
    checked = [str(p) for p in SERVICE_ACCOUNT_KEY_CANDIDATES]
    raise FileNotFoundError(f"serviceAccountKey.json not found. Checked: {checked}")


def initialize_firestore() -> firestore.Client:
    key_path = resolve_service_key()
    if not firebase_admin._apps:
        cred = credentials.Certificate(str(key_path))
        firebase_admin.initialize_app(cred)
    return firestore.client()


def random_birth_date() -> str:
    year = random.randint(1970, 2005)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return f"{year:04d}-{month:02d}-{day:02d}"


def build_pairs(language: str, pair_count: int) -> list[str]:
    countries = COUNTRIES_ZH if language == "zh" else COUNTRIES_EN
    joiner = " 和 " if language == "zh" else " and "

    all_pairs = []
    for i in range(len(countries)):
        for j in range(i + 1, len(countries)):
            all_pairs.append(f"{countries[i]}{joiner}{countries[j]}")

    random.shuffle(all_pairs)
    return all_pairs[: max(1, pair_count)]


def build_mock_payload(uuid_value: str, language: str, pair_count: int) -> dict:
    now_iso = datetime.now(timezone.utc).isoformat()
    followup_options = FOLLOWUP_OPTIONS_ZH if language == "zh" else FOLLOWUP_OPTIONS_EN

    answers = {
        "birth_date": random_birth_date(),
        "gender": random.choice(["男", "女", "其他"] if language == "zh" else ["Male", "Female", "Other"]),
        "education": random.choice(
            ["小学", "初中", "高中", "大学", "硕士", "博士"]
            if language == "zh"
            else ["Primary School", "Junior High", "High School", "University", "Master's", "Doctorate"]
        ),
        "second_languages": random.randint(0, 4),
        "social_status": random.randint(1, 10),
        "final_thoughts": "这是一条用于人工核查流程的虚拟作答记录，便于验证入库字段是否完整。"
        if language == "zh"
        else "This is a synthetic response for manual QA to verify database fields.",
    }

    pair_question_map = {}
    pair_responses = []

    for idx, pair in enumerate(build_pairs(language, pair_count)):
        slider_id = f"slider_{idx}"
        followup_id = f"followup_{idx}"
        score = random.randint(0, 100)
        followup_factors = random.sample(followup_options, k=random.randint(1, 3))

        answers[slider_id] = score
        answers[followup_id] = followup_factors

        pair_question_map[slider_id] = {"type": "slider", "pair": pair}
        pair_question_map[followup_id] = {"type": "multiple_choice", "pair": pair}

        pair_responses.append(
            {
                "pairQuestionId": slider_id,
                "pair": pair,
                "score": score,
                "followupQuestionId": followup_id,
                "followupFactors": followup_factors,
            }
        )

    return {
        "uuid": uuid_value,
        "ip": f"203.0.113.{random.randint(2, 200)}",
        "answers": answers,
        "pairQuestionMap": pair_question_map,
        "pairResponses": pair_responses,
        "userAgent": "mock-generator/1.0",
        "language": language,
        "duration": random.randint(360, 1200),
        "clientTimestamp": now_iso,
        "submitPrimary": "firebase",
        "submitBackend": "firebase",
        "submitFallbackUsed": False,
        "mockData": True,
        "mockGeneratedAt": now_iso,
        "timestamp": firestore.SERVER_TIMESTAMP,
    }


def create_mock_submissions(count: int, language: str, pair_count: int, prefix: str) -> list[dict]:
    db = initialize_firestore()
    created = []

    for _ in range(count):
        uuid_value = f"{prefix}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{uuid4().hex[:8]}"
        payload = build_mock_payload(uuid_value, language, pair_count)
        db.collection("surveyResponses").document(uuid_value).set(payload)

        created.append(
            {
                "uuid": uuid_value,
                "language": language,
                "pairCount": len(payload["pairResponses"]),
                "duration": payload["duration"],
            }
        )

    return created


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate mock survey responses and submit to Firebase.")
    parser.add_argument("--count", type=int, default=1, help="Number of mock responses to create")
    parser.add_argument("--language", choices=["zh", "en"], default="zh", help="Language of generated response")
    parser.add_argument("--pair-count", type=int, default=8, help="Number of generated country pairs per response")
    parser.add_argument("--prefix", default="mock", help="UUID prefix for generated responses")
    args = parser.parse_args()

    if args.count < 1:
        raise ValueError("--count must be >= 1")
    if args.pair_count < 1:
        raise ValueError("--pair-count must be >= 1")

    created = create_mock_submissions(args.count, args.language, args.pair_count, args.prefix)
    print("Created mock submissions:")
    print(json.dumps(created, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
