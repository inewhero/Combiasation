<script setup>
import { ref } from 'vue';

const props = defineProps({
  content: Object
});

const emit = defineEmits(['agree', 'disagree']);

const handleAgree = () => {
  emit('agree');
};

const handleDisagree = () => {
  emit('disagree');
};
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">{{ content.title }}</h2>
    
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div class="prose max-w-none text-gray-600 whitespace-pre-line">
        {{ content.consent.text }}
      </div>
    </div>

    <div class="flex justify-center space-x-4 mt-8">
      <button 
        @click="handleDisagree"
        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        {{ content.consent.disagree }}
      </button>
      <button 
        @click="handleAgree"
        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ content.consent.agree }}
      </button>
    </div>
  </div>
</template>
