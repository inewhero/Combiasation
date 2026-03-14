<script setup>
import { computed } from 'vue';

const props = defineProps({
  content: Object,
  uuid: String
});

const emit = defineEmits(['start']);

const memberSeparator = computed(() => (props.content.locale === 'zh' ? '、' : ', '));

const handleStart = () => {
  emit('start');
};
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-center text-blue-800">{{ content.title }}</h1>
    
    <div class="prose max-w-none text-gray-600 whitespace-pre-line">
      {{ content.intro }}
    </div>

    <div class="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm text-blue-800 whitespace-pre-line">
      {{ content.info }}
    </div>

    <div v-if="content.unionMembers" class="grid gap-4 sm:grid-cols-2">
      <div class="bg-white p-4 rounded-md border border-gray-200">
        <h3 class="font-semibold text-gray-800 mb-2">{{ content.unionMembers.euTitle }}</h3>
        <p class="text-sm text-gray-600 whitespace-pre-line">{{ content.unionMembers.euMembers.join(memberSeparator) }}</p>
      </div>
      <div class="bg-white p-4 rounded-md border border-gray-200">
        <h3 class="font-semibold text-gray-800 mb-2">{{ content.unionMembers.auTitle }}</h3>
        <p class="text-sm text-gray-600 whitespace-pre-line">{{ content.unionMembers.auMembers.join(memberSeparator) }}</p>
      </div>
    </div>

    <button
      @click="handleStart"
      class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
    >
      {{ content.startButton || (content.locale === 'zh' ? "开始答题" : "Start Survey") }}
    </button>
    
    <div class="text-xs text-gray-400 text-center mt-4">
      ID: {{ uuid }}
    </div>
  </div>
</template>
