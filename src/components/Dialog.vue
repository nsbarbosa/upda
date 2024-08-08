<template>
  <VDialog v-model="props.show" persistent width="auto">
    <VCard class="pa-4">
      <VCardTitle class="text-h5">Confirmar conclusão da tarefa?</VCardTitle>
      <VCardText class="mb-3">Ao confirmar a operação, ela não poderá ser desfeita</VCardText>
      <VCard-actions>
        <VSpacer />
        <VBtn variant="text" @click="onCancel" class="px-3">Cancel</VBtn>
        <VBtn variant="tonal" @click="onConfirm" class="px-3">
          Confirmar
        </VBtn>
      </VCard-actions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
const emit = defineEmits(['confirm', 'cancel'])
const props = defineProps({
  show: Boolean,
});
function onConfirm() {
  emit('confirm');
}
function onCancel() {
  emit('cancel');
}
</script>