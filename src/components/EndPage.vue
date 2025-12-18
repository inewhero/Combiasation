<script setup>
import qrZh from '../data/qr_zh.png';
import qrEn from '../data/qr_en.jpg';

defineProps({
  content: Object,
  uuid: String
});
</script>

<template>
  <div class="text-center space-y-6 py-10">
    <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
      <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    
    <h2 class="text-2xl font-bold text-gray-900">
      {{ content.title === "G20国家相似度调查" ? "感谢您的参与！" : "Thank You!" }}
    </h2>
    
    <p class="text-gray-600">
      {{ content.title === "G20国家相似度调查" ? "您的回答已成功提交。" : "Your response has been successfully submitted." }}
    </p>

    <div class="bg-gray-50 p-4 rounded-md border border-gray-200 inline-block text-left">
      <p class="text-sm text-gray-500 mb-1">
        {{ content.title === "G20国家相似度调查" ? "您的唯一ID (请保存以便领取报酬):" : "Your Unique ID (Please save for reward):" }}
      </p>
      <p class="text-lg font-mono font-bold text-blue-600 select-all">
        {{ uuid }}
      </p>
    </div>

    <!-- Payment Section -->
    <div v-if="content.endPage" class="mt-8 space-y-4 max-w-md mx-auto">
      <p class="text-gray-700">{{ content.endPage.paymentInstruction }}</p>
      
      <div class="flex justify-center">
        <img 
          :src="content.title === 'G20国家相似度调查' ? qrZh : qrEn" 
          alt="Payment QR Code" 
          class="w-48 h-48 object-contain border border-gray-200 rounded-lg"
        />
      </div>
      
      <div>
        <a 
          :href="content.endPage.paymentLink" 
          target="_blank" 
          class="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {{ content.endPage.paymentLinkText }}
        </a>
      </div>
    </div>
  </div>
</template>
