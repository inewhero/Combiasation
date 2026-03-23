import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { surveyData } from '../src/data/questions.js';

const hashStringToSeed = (text) => {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createSeededRandom = (seed) => {
  let state = seed || 1;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffleArray = (array, randomFn = Math.random) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`.env file not found: ${filePath}`);
  }

  const result = {};
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index < 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
};

const parseArgs = (argv) => {
  const options = {
    language: 'zh',
    duration: 600,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--language' && argv[i + 1]) {
      options.language = argv[++i];
    } else if (arg === '--uuid' && argv[i + 1]) {
      options.uuid = argv[++i];
    } else if (arg === '--duration' && argv[i + 1]) {
      options.duration = Number(argv[++i]);
    }
  }

  if (!['zh', 'en'].includes(options.language)) {
    throw new Error('--language must be zh or en');
  }

  if (!Number.isFinite(options.duration) || options.duration < 1) {
    throw new Error('--duration must be a positive number (seconds)');
  }

  return options;
};

const parseCountriesFromPair = (pairText) => {
  const raw = String(pairText || '').trim();
  if (!raw) return [];

  if (raw.includes(' 和 ')) {
    return raw.split(' 和 ').map((item) => item.trim()).filter(Boolean);
  }
  if (raw.includes(' and ')) {
    return raw.split(' and ').map((item) => item.trim()).filter(Boolean);
  }
  return [raw];
};

const pickOne = (randomFn, items) => items[Math.floor(randomFn() * items.length)];

const pickSome = (randomFn, items, minCount, maxCount) => {
  const cloned = [...items];
  shuffleArray(cloned, randomFn);
  const count = Math.min(cloned.length, Math.max(minCount, Math.floor(randomFn() * (maxCount - minCount + 1)) + minCount));
  return cloned.slice(0, count);
};

const buildQuestionsLikeFrontend = (content, uuid) => {
  const seed = hashStringToSeed(`${uuid}::${content.locale || 'zh'}`);
  const randomFn = createSeededRandom(seed);
  const qList = [];

  content.personalInfo.forEach((info) => {
    qList.push({ ...info, category: 'personal' });
  });

  const allPairs = [...content.sliderPairs];
  shuffleArray(allPairs, randomFn);
  const sampledPairCount = Math.max(1, Math.ceil(allPairs.length * 0.5));
  const pairs = allPairs.slice(0, sampledPairCount);

  pairs.forEach((pair, index) => {
    qList.push({
      id: `slider_${index}`,
      type: 'slider',
      label: `${content.sliderPrompt}<strong>${pair}</strong>`,
      pair,
      required: true,
      category: 'main',
    });

    if (randomFn() < 0.1) {
      qList.push({
        id: `followup_${index}`,
        type: 'multiple_choice',
        label: content.multipleChoicePrompt.replace('{pair}', pair),
        pair,
        options: shuffleArray([...content.multipleChoiceOptions], randomFn),
        required: true,
        category: 'main',
      });
    }
  });

  qList.push({
    id: 'final_thoughts',
    type: 'text_input_long',
    label: content.longTextPrompt,
    required: true,
    category: 'final',
  });

  return { qList, randomFn };
};

const buildAnswersAndSliderRatings = (qList, content, randomFn) => {
  const answers = {};
  const sliderRatings = [];

  qList.forEach((q) => {
    if (q.type === 'date') {
      const year = 1970 + Math.floor(randomFn() * 30);
      const month = 1 + Math.floor(randomFn() * 12);
      const day = 1 + Math.floor(randomFn() * 28);
      answers[q.id] = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return;
    }

    if (q.type === 'single_choice') {
      answers[q.id] = pickOne(randomFn, q.options || []);
      return;
    }

    if (q.type === 'number') {
      answers[q.id] = Math.floor(randomFn() * 5);
      return;
    }

    if (q.type === 'scale') {
      const min = Number(q.min || 1);
      const max = Number(q.max || 10);
      answers[q.id] = min + Math.floor(randomFn() * (max - min + 1));
      return;
    }

    if (q.type === 'slider') {
      answers[q.id] = Math.floor(randomFn() * 101);

      sliderRatings.push({
        questionId: q.id,
        countries: parseCountriesFromPair(q.pair),
        score: answers[q.id],
      });
      return;
    }

    if (q.type === 'multiple_choice') {
      answers[q.id] = pickSome(randomFn, q.options || [], 1, 3);
      return;
    }

    if (q.type === 'text_input_long') {
      answers[q.id] = content.locale === 'zh'
        ? '这是一次按真实问卷流程自动生成的完整模拟作答，用于人工核查提交结构。'
        : 'This is an end-to-end mock response generated through the normal survey flow for QA checks.';
    }
  });

  sliderRatings.forEach((sliderItem) => {
    const idx = sliderItem.questionId.replace('slider_', '');
    const followupId = `followup_${idx}`;
    const followupFactors = answers[followupId];
    if (Array.isArray(followupFactors) && followupFactors.length > 0) {
      sliderItem.followup = {
        questionId: followupId,
        factors: followupFactors,
      };
    }
  });

  return { answers, sliderRatings };
};

const buildSubmissionAnswers = (answers, sliderRatings) => {
  const cleanedAnswers = { ...answers };
  Object.keys(cleanedAnswers).forEach((key) => {
    if (key.startsWith('slider_')) {
      delete cleanedAnswers[key];
    }
  });
  cleanedAnswers.sliderRatings = sliderRatings;
  return cleanedAnswers;
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(scriptDir, '..');
  const envPath = path.join(projectRoot, '.env');
  const envVars = parseEnvFile(envPath);

  const firebaseConfig = {
    apiKey: envVars.VITE_FIREBASE_API_KEY,
    authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: envVars.VITE_FIREBASE_PROJECT_ID,
    storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: envVars.VITE_FIREBASE_APP_ID,
    measurementId: envVars.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length > 0) {
    throw new Error(`Missing Firebase config in .env: ${missing.join(', ')}`);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const uuid = options.uuid || `mock-flow-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const content = surveyData[options.language];
  const { qList, randomFn } = buildQuestionsLikeFrontend(content, uuid);
  const { answers, sliderRatings } = buildAnswersAndSliderRatings(qList, content, randomFn);
  const submissionAnswers = buildSubmissionAnswers(answers, sliderRatings);

  const payload = {
    uuid,
    ip: '',
    answers: submissionAnswers,
    userAgent: 'mock-submit-full-flow-script',
    language: content.locale,
    duration: Math.round(options.duration),
    clientTimestamp: new Date().toISOString(),
    submitPrimary: 'firebase',
    submitBackend: 'firebase',
    submitFallbackUsed: false,
    mockData: true,
    mockMode: 'full-flow',
  };

  await setDoc(doc(db, 'surveyResponses', uuid), {
    ...payload,
    timestamp: serverTimestamp(),
  });

  console.log(JSON.stringify({
    ok: true,
    uuid,
    language: content.locale,
    sliderCount: sliderRatings.length,
    followupCount: sliderRatings.filter((x) => !!x.followup).length,
  }, null, 2));
};

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exitCode = 1;
});
