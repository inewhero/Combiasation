<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebaseConfig';

const props = defineProps({
  content: Object,
  uuid: String
});

const emit = defineEmits(['finish']);

const questions = ref([]);
const currentQuestionIndex = ref(0);
const answers = ref({});
const submitting = ref(false);
const error = ref('');
const startTime = ref(0);
const isHydratingDraft = ref(true);

const draftStorageKey = computed(
  () => `survey_draft_${props.uuid || 'anonymous'}_${props.content.locale || 'zh'}`
);

// Deterministic PRNG helpers so each UUID gets stable question sampling.
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

const saveDraft = () => {
  if (!questions.value.length || isHydratingDraft.value) return;
  const draft = {
    currentQuestionIndex: currentQuestionIndex.value,
    answers: answers.value,
    startTime: startTime.value,
    updatedAt: Date.now(),
  };
  localStorage.setItem(draftStorageKey.value, JSON.stringify(draft));
};

const clearDraft = () => {
  localStorage.removeItem(draftStorageKey.value);
};

const loadDraft = () => {
  const raw = localStorage.getItem(draftStorageKey.value);
  if (!raw) return;

  try {
    const draft = JSON.parse(raw);
    if (!draft || typeof draft !== 'object') return;

    if (typeof draft.startTime === 'number' && draft.startTime > 0) {
      startTime.value = draft.startTime;
    }

    const validQuestionIds = new Set(questions.value.map((q) => q.id));
    const restoredAnswers = { ...answers.value };

    Object.entries(draft.answers || {}).forEach(([questionId, value]) => {
      if (validQuestionIds.has(questionId)) {
        restoredAnswers[questionId] = value;
      }
    });

    answers.value = restoredAnswers;

    const maxIndex = Math.max(questions.value.length - 1, 0);
    const restoredIndex = Number(draft.currentQuestionIndex);
    if (Number.isInteger(restoredIndex)) {
      currentQuestionIndex.value = Math.min(Math.max(restoredIndex, 0), maxIndex);
    }
  } catch (e) {
    console.warn('Failed to restore local draft:', e);
  }
};

onMounted(() => {
  startTime.value = Date.now();
  const qList = [];
  const seed = hashStringToSeed(`${props.uuid || 'anonymous'}::${props.content.locale || 'zh'}`);
  const randomFn = createSeededRandom(seed);

  // 1. Personal Info
  props.content.personalInfo.forEach(info => {
    qList.push({
      ...info,
      category: 'personal'
    });
  });

  // 2. Sample 50% of country pairs per participant, then add random follow-up
  const allPairs = [...props.content.sliderPairs];
  shuffleArray(allPairs, randomFn);
  const sampledPairCount = Math.max(1, Math.ceil(allPairs.length * 0.5));
  const pairs = allPairs.slice(0, sampledPairCount);

  pairs.forEach((pair, index) => {
    // Slider Question
    qList.push({
      id: `slider_${index}`,
      type: 'slider',
      label: props.content.sliderPrompt + '<strong>' + pair + '</strong>',
      pair: pair,
      required: true,
      category: 'main'
    });

    // 10% chance for Follow-up Multiple Choice
    if (randomFn() < 0.1) {
      qList.push({
        id: `followup_${index}`,
        type: 'multiple_choice',
        label: props.content.multipleChoicePrompt.replace('{pair}', pair),
        pair: pair,
        options: shuffleArray([...props.content.multipleChoiceOptions], randomFn),
        required: true, // Assuming required as it's a question
        category: 'main'
      });
    }
  });

  // 3. Long Text
  qList.push({
    id: 'final_thoughts',
    type: 'text_input_long',
    label: props.content.longTextPrompt,
    required: true,
    category: 'final'
  });

  questions.value = qList;

  // Initialize answers for multiple choice
  qList.forEach(q => {
    if (q.type === 'multiple_choice') {
      answers.value[q.id] = [];
    }
    if (q.type === 'date') {
      answers.value[q.id] = '2000-01-01';
    }
  });

  loadDraft();
  isHydratingDraft.value = false;
  saveDraft();
});

watch(currentQuestionIndex, saveDraft);
watch(answers, saveDraft, { deep: true });

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const progress = computed(() => {
  if (questions.value.length === 0) return 0;
  return Math.round(((currentQuestionIndex.value) / questions.value.length) * 100);
});

const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);

const validateCurrent = () => {
  const q = currentQuestion.value;
  const val = answers.value[q.id];

  if (q.required) {
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
  }

  if (q.type === 'date') {
    const [y, m, d] = val.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    
    // Check if date is valid (e.g. Feb 31 -> Mar 3)
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
      error.value = props.content.locale === 'zh' ? "日期无效" : "Invalid date";
      return false;
    }
    
    // Check future date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      error.value = props.content.locale === 'zh' ? "日期不能在未来" : "Date cannot be in the future";
      return false;
    }
  }

  if (q.type === 'text_input_long') {
    const textLength = String(val || '').trim().length;
    if (textLength <= 20) {
      error.value = props.content.locale === 'zh' ? "请至少填写21个字" : "Please provide at least 21 characters";
      return false;
    }
  }

  return true;
};

const buildPairAnswerPayload = () => {
  const parseCountriesFromPair = (pairText) => {
    const raw = String(pairText || '').trim();
    if (!raw) return [null, null];

    const separator = raw.includes(' 和 ')
      ? ' 和 '
      : raw.includes(' and ')
        ? ' and '
        : null;

    if (!separator) return [raw, null];

    const [country1, country2] = raw.split(separator).map((item) => item.trim());
    return [country1 || null, country2 || null];
  };

  const sliderRatings = [];

  questions.value.forEach((q) => {
    if (q.type !== 'slider') return;

    const scoreRaw = answers.value[q.id];
    const score = scoreRaw === '' || scoreRaw === undefined || scoreRaw === null
      ? null
      : Number(scoreRaw);

    const followupId = q.id.replace('slider_', 'followup_');
    const followupFactors = Array.isArray(answers.value[followupId])
      ? answers.value[followupId]
      : [];
    const countries = parseCountriesFromPair(q.pair).filter(Boolean);

    const sliderItem = {
      questionId: q.id,
      countries,
      score,
    };

    if (followupFactors.length > 0) {
      sliderItem.followup = {
        questionId: followupId,
        factors: followupFactors,
      };
    }

    sliderRatings.push(sliderItem);
  });

  return {
    sliderRatings,
  };
};

const buildSubmissionAnswers = () => {
  const cleanedAnswers = { ...answers.value };
  const { sliderRatings } = buildPairAnswerPayload();

  Object.keys(cleanedAnswers).forEach((key) => {
    if (key.startsWith('slider_')) {
      delete cleanedAnswers[key];
    }
  });

  cleanedAnswers.sliderRatings = sliderRatings;
  return cleanedAnswers;
};

const nextQuestion = () => {
  error.value = '';
  
  // Developer Mode: Check for 1925-01-01
  if (currentQuestion.value.type === 'date' && answers.value[currentQuestion.value.id] === '1925-01-01') {
    clearDraft();
    emit('finish');
    return;
  }

  if (!validateCurrent()) {
    if (!error.value) {
      error.value = props.content.locale === 'zh' ? "请回答此问题" : "Please answer this question";
    }
    return;
  }
  
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
    window.scrollTo(0, 0);
  }
};

const submitSurvey = async () => {
  if (!validateCurrent()) {
    error.value = props.content.locale === 'zh' ? "请回答此问题" : "Please answer this question";
    return;
  }
  
  submitting.value = true;
  try {
    // Get IP again for record
    let ip = '';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ip = ipData?.ip || '';
    } catch (ipError) {
      console.warn('Failed to fetch IP address:', ipError);
    }

    const baseSubmissionData = {
      uuid: props.uuid,
      ip,
      answers: buildSubmissionAnswers(),
      userAgent: navigator.userAgent,
      language: props.content.locale,
      duration: Math.round((Date.now() - startTime.value) / 1000),
      clientTimestamp: new Date().toISOString(),
      submitPrimary: 'firebase',
      submitBackend: 'firebase',
      submitFallbackUsed: false,
    };

    await setDoc(doc(db, "surveyResponses", props.uuid), {
      ...baseSubmissionData,
      timestamp: serverTimestamp(),
    });

    clearDraft();
    emit('finish');
  } catch (e) {
    console.error("Error submitting:", e);
    if (e?.code === 'permission-denied') {
      clearDraft();
      emit('finish', { duplicate: true });
      return;
    } else {
      error.value = "Submission failed. Please try again.";
    }
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div v-if="questions.length > 0">
    <!-- Progress Bar -->
    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="text-right text-xs text-gray-500 mb-4">
      {{ currentQuestionIndex + 1 }} / {{ questions.length }}
    </div>

    <!-- Question Card -->
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm min-h-[300px] flex flex-col">
      <h2 class="text-xl font-medium mb-6 text-gray-800"><span v-html="currentQuestion.label"></span> <span v-if="currentQuestion.required" class="text-red-500">*</span></h2>

      <div class="flex-grow">
        <!-- Text Input (Short) -->
        <input 
          v-if="currentQuestion.type === 'text_input'"
          v-model="answers[currentQuestion.id]"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />

        <!-- Date -->
        <div v-if="currentQuestion.type === 'date'" class="flex space-x-2">
          <select 
            :value="answers[currentQuestion.id]?.split('-')[0]" 
            @change="(e) => {
              const [y, m, d] = (answers[currentQuestion.id] || '2000-01-01').split('-');
              answers[currentQuestion.id] = `${e.target.value}-${m}-${d}`;
            }"
            class="w-1/3 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="year in 100" :key="year" :value="2025 - year">{{ 2025 - year }}</option>
          </select>
          <select 
            :value="answers[currentQuestion.id]?.split('-')[1]" 
            @change="(e) => {
              const [y, m, d] = (answers[currentQuestion.id] || '2000-01-01').split('-');
              answers[currentQuestion.id] = `${y}-${e.target.value}-${d}`;
            }"
            class="w-1/3 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="month in 12" :key="month" :value="String(month).padStart(2, '0')">{{ month }}</option>
          </select>
          <select 
            :value="answers[currentQuestion.id]?.split('-')[2]" 
            @change="(e) => {
              const [y, m, d] = (answers[currentQuestion.id] || '2000-01-01').split('-');
              answers[currentQuestion.id] = `${y}-${m}-${e.target.value}`;
            }"
            class="w-1/3 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="day in 31" :key="day" :value="String(day).padStart(2, '0')">{{ day }}</option>
          </select>
        </div>

        <!-- Number -->
        <input 
          v-if="currentQuestion.type === 'number'"
          v-model="answers[currentQuestion.id]"
          type="number"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />

        <!-- Single Choice -->
        <div v-if="currentQuestion.type === 'single_choice'" class="space-y-3">
          <label v-for="option in currentQuestion.options" :key="option" class="flex items-center space-x-3 cursor-pointer p-3 border rounded-md hover:bg-gray-50" :class="{'bg-blue-50 border-blue-200': answers[currentQuestion.id] === option}">
            <input 
              type="radio" 
              :name="currentQuestion.id" 
              :value="option" 
              v-model="answers[currentQuestion.id]"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-gray-700">{{ option }}</span>
          </label>
        </div>

        <!-- Scale (1-10) -->
        <div v-if="currentQuestion.type === 'scale'" class="space-y-4">
          <!-- Special UI for Social Status Ladder -->
          <div v-if="currentQuestion.id === 'social_status'" class="space-y-6">
             <p class="text-sm text-gray-600 italic bg-gray-50 p-3 rounded border border-gray-200">
               {{ content.socialStatusInstruction }}
             </p>
             <div class="flex flex-col items-center space-y-1">
               <div 
                 v-for="n in 10" 
                 :key="11-n" 
                 @click="answers[currentQuestion.id] = 11-n"
                 class="w-48 h-10 border-2 flex items-center justify-center cursor-pointer transition-colors duration-200 font-bold relative"
                 :class="[
                   answers[currentQuestion.id] === (11-n) 
                     ? 'bg-blue-600 border-blue-600 text-white' 
                     : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                 ]"
               >
                 {{ 11-n }}
                 <!-- Labels for Top and Bottom -->
                 <span v-if="11-n === 10" class="absolute -right-24 text-xs text-gray-500 w-20 text-left hidden sm:block">{{ content.socialStatusLabels.best }}</span>
                 <span v-if="11-n === 1" class="absolute -right-24 text-xs text-gray-500 w-20 text-left hidden sm:block">{{ content.socialStatusLabels.worst }}</span>
               </div>
             </div>
          </div>

          <!-- Default Scale UI -->
          <div v-else>
            <div class="flex justify-between px-2">
              <span v-for="n in 10" :key="n" class="text-xs text-gray-500">{{ n }}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1" 
              v-model.number="answers[currentQuestion.id]"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div class="text-center font-bold text-blue-600 text-lg">
              {{ answers[currentQuestion.id] }}
            </div>
          </div>
        </div>

        <!-- Slider (0-100%) -->
        <div v-if="currentQuestion.type === 'slider'" class="space-y-6">
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            v-model.number="answers[currentQuestion.id]"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ content.sliderLabels.dissimilar }}</span>
            <span class="font-bold text-blue-600 text-lg">{{ answers[currentQuestion.id] !== undefined ? answers[currentQuestion.id] + '%' : '-' }}</span>
            <span>{{ content.sliderLabels.similar }}</span>
          </div>
        </div>

        <!-- Multiple Choice -->
        <div v-if="currentQuestion.type === 'multiple_choice'" class="grid grid-cols-2 gap-4">
          <label v-for="option in currentQuestion.options" :key="option" class="flex items-center space-x-3 cursor-pointer p-3 border rounded-md hover:bg-gray-50" :class="{'bg-blue-50 border-blue-200': answers[currentQuestion.id]?.includes(option)}">
            <input 
              type="checkbox" 
              :value="option" 
              v-model="answers[currentQuestion.id]"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span class="text-gray-700">{{ option }}</span>
          </label>
        </div>

        <!-- Long Text -->
        <textarea 
          v-if="currentQuestion.type === 'text_input_long'"
          v-model="answers[currentQuestion.id]"
          rows="5"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 text-red-600 text-sm">
        {{ error }}
      </div>

      <!-- Navigation -->
      <div class="mt-8 flex justify-center">
        <button 
          v-if="!isLastQuestion"
          @click="nextQuestion"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {{ content.buttons?.next || 'Next' }}
        </button>
        <button 
          v-else
          @click="submitSurvey"
          :disabled="submitting"
          class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {{ submitting ? (content.locale === 'zh' ? '提交中...' : 'Submitting...') : (content.buttons?.submit || 'Submit') }}
        </button>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-10">
    Loading questions...
  </div>
</template>
