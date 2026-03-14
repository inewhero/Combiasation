<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { surveyData } from './data/questions';
import LandingPage from './components/LandingPage.vue';
import ConsentPage from './components/ConsentPage.vue';
import QuestionnairePage from './components/QuestionnairePage.vue';
import EndPage from './components/EndPage.vue';
import { v4 as uuidv4 } from 'uuid';

const currentStep = ref('landing'); // landing, consent, questionnaire, end, declined
const language = ref('zh'); // zh, en
const userUUID = ref('');
const submissionResult = ref({ duplicate: false });
const hasDraftForCurrentLanguage = ref(false);

const content = computed(() => surveyData[language.value]);

const getDraftStorageKey = (uuid, lang) => `survey_draft_${uuid || 'anonymous'}_${lang || 'zh'}`;

const hasLocalDraft = (uuid, lang) => {
  const raw = localStorage.getItem(getDraftStorageKey(uuid, lang));
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    return !!parsed && typeof parsed === 'object' && !!parsed.answers;
  } catch {
    return false;
  }
};

const clearLocalDraft = (uuid, lang) => {
  localStorage.removeItem(getDraftStorageKey(uuid, lang));
};

const refreshDraftAvailability = () => {
  hasDraftForCurrentLanguage.value = hasLocalDraft(userUUID.value, language.value);
};

const getPathSegments = () => window.location.pathname.split('/').filter(Boolean);

const getLanguageFromPath = () => {
  const lastSegment = getPathSegments().at(-1);
  return lastSegment === 'zh' || lastSegment === 'en' ? lastSegment : null;
};

const getAppBasePath = () => {
  const segments = getPathSegments();
  if (segments.length === 0) return '';
  const lastSegment = segments[segments.length - 1];
  const baseSegments = lastSegment === 'zh' || lastSegment === 'en'
    ? segments.slice(0, -1)
    : segments;
  return baseSegments.length ? `/${baseSegments.join('/')}` : '';
};

const getLocalizedPath = (lang) => `${getAppBasePath()}/${lang}`.replace(/\/+/g, '/');

const applyLanguageFromPath = () => {
  const pathLanguage = getLanguageFromPath();
  if (pathLanguage) {
    language.value = pathLanguage;
    refreshDraftAvailability();
    return true;
  }
  return false;
};

onMounted(() => {
  // Check if UUID exists in localStorage
  let storedUUID = localStorage.getItem('survey_uuid');
  if (!storedUUID) {
    storedUUID = uuidv4();
    localStorage.setItem('survey_uuid', storedUUID);
  }
  userUUID.value = storedUUID;

  // Use /zh or /en from path first; fallback to browser detection and redirect.
  if (!applyLanguageFromPath()) {
    const browserLang = navigator.language || navigator.userLanguage;
    const detectedLanguage = browserLang.toLowerCase().startsWith('en') ? 'en' : 'zh';
    language.value = detectedLanguage;
    history.replaceState({}, '', getLocalizedPath(detectedLanguage));
  }

  refreshDraftAvailability();

  window.addEventListener('popstate', applyLanguageFromPath);
});

onUnmounted(() => {
  window.removeEventListener('popstate', applyLanguageFromPath);
});

const setLanguage = (lang) => {
  if (lang === language.value) return;
  language.value = lang;
  refreshDraftAvailability();
  history.pushState({}, '', getLocalizedPath(lang));
};

const startSurvey = () => {
  submissionResult.value = { duplicate: false };
  currentStep.value = 'consent';
};

const continueFromDraft = () => {
  submissionResult.value = { duplicate: false };
  currentStep.value = 'questionnaire';
};

const restartFromDraft = () => {
  clearLocalDraft(userUUID.value, language.value);
  hasDraftForCurrentLanguage.value = false;
  submissionResult.value = { duplicate: false };
  currentStep.value = 'questionnaire';
};

const onConsentAgree = () => {
  submissionResult.value = { duplicate: false };
  currentStep.value = 'questionnaire';
};

const onConsentDisagree = () => {
  currentStep.value = 'declined';
};

const finishSurvey = (result = {}) => {
  submissionResult.value = {
    duplicate: !!result.duplicate,
  };
  currentStep.value = 'end';
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      
      <!-- Language Switcher -->
      <div v-if="currentStep === 'landing'" class="flex justify-end p-4 bg-gray-100 border-b">
        <button 
          @click="setLanguage('zh')" 
          :class="['px-3 py-1 rounded-l-md border', language === 'zh' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700']"
        >
          中文
        </button>
        <button 
          @click="setLanguage('en')" 
          :class="['px-3 py-1 rounded-r-md border', language === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700']"
        >
          English
        </button>
      </div>

      <div class="p-6 sm:p-10">
        <div
          v-if="currentStep === 'landing' && hasDraftForCurrentLanguage"
          class="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4"
        >
          <p class="text-sm text-amber-900 mb-3">
            {{ language === 'zh'
              ? '检测到您有未完成的作答记录，您可以选择继续作答或重做。'
              : 'An unfinished response draft was found. You can continue or restart.' }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              @click="continueFromDraft"
              class="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700"
            >
              {{ language === 'zh' ? '继续作答' : 'Continue' }}
            </button>
            <button
              @click="restartFromDraft"
              class="px-4 py-2 rounded-md bg-white border border-amber-300 text-amber-900 hover:bg-amber-100"
            >
              {{ language === 'zh' ? '重做' : 'Restart' }}
            </button>
          </div>
        </div>

        <LandingPage 
          v-if="currentStep === 'landing'" 
          :content="content" 
          :uuid="userUUID"
          @start="startSurvey" 
        />

        <ConsentPage 
          v-if="currentStep === 'consent'" 
          :content="content" 
          @agree="onConsentAgree"
          @disagree="onConsentDisagree"
        />
        
        <QuestionnairePage 
          v-if="currentStep === 'questionnaire'" 
          :content="content" 
          :uuid="userUUID"
          @finish="finishSurvey" 
        />
        
        <EndPage 
          v-if="currentStep === 'end'" 
          :content="content" 
          :uuid="userUUID"
          :duplicate-submission="submissionResult.duplicate"
        />

        <div v-if="currentStep === 'declined'" class="text-center py-10">
          <h2 class="text-xl font-bold text-gray-800 mb-4">
            {{ language === 'zh' ? '您已选择退出研究。' : 'You have chosen to withdraw from the study.' }}
          </h2>
          <p class="text-gray-600">
            {{ language === 'zh' ? '感谢您的关注。您可以关闭此页面。' : 'Thank you for your interest. You may close this page.' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
