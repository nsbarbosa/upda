<template>
    <VDialog :model-value="true" width="500px">
        <VCard class="pa-4 mb-4" elevation="3">
            <VCardTitle class="d-flex justify-space-between align-center">
                <span class="text-h5">{{ task.title }}</span>
                <VChip v-if="task.concluded" color="success" dark>
                    <VIcon class="mr-2">mdi-check-circle-outline</VIcon>
                    Concluída há {{ daysSinceCompletion }} dias
                </VChip>
                <VChip v-else color="error" dark>
                    <VIcon class="mr-2">mdi-close-circle-outline</VIcon>
                    Não Concluída
                </VChip>
            </VCardTitle>
            <VCardSubtitle>
                {{ task.description }}
            </VCardSubtitle>
            <VCardItem>

                <small>
                    <strong>Data de conclusão:</strong>
                    {{ formattedCompletionDate }}
                </small>
            </VCardItem>
            <VCard-actions>
                <VSpacer />
                <VBtn variant="text" @click="onClose" class="px-3">Fechar</VBtn>
            </VCard-actions>

        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
import { Task } from '@/interfaces/Tasks';
import { computed } from 'vue';
import { VCardItem } from 'vuetify/components';

const emit = defineEmits(['close'])
const props = defineProps<{
    task: Task
}>();

const formattedCompletionDate = computed(() => {
    const date = new Date(props.task.completionDate);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
});

const daysSinceCompletion = computed(() => {
    if (props.task.completionDate) {
        const completionDate = new Date(props.task.completionDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - completionDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
});

function onClose() {
    emit('close');
}
</script>