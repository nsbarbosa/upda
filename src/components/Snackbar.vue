<template>
  <VSnackbar v-model="store.snackbar.show" transition="scale-transition" location="bottom"
    :timeout="store.snackbar.timeout ? store.snackbar.timeout : 4000" :color="store.snackbar.color">
    {{ store.snackbar.content }}
    <template #actions>
      <VBtn icon="mdi-close" size="small" color="white" @click="store.snackbar.show = false">
      </VBtn>
    </template>
  </VSnackbar>
</template>
<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification';
const store = useNotificationStore();
</script>