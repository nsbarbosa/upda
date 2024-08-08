<template>
  <VDialog :model-value="true" persistent max-width="600px">
    <VCard class="pa-4">
      <template v-slot:prepend>
        <VCardTitle class="text-h5">
          {{ isEdition ? "Editar Tarefa" : "Nova Tarefa" }}
        </VCardTitle>
      </template>
      <template v-slot:append>
        <VBtn icon="mdi-close" size="small" variant="text" @click="onCancel"></VBtn>
      </template>
      <VCardItem>
        <VRow>
          <VCol cols="12">
            <VTextField v-model="editedTask.title" label="Título" :error-messages="formErrors.title"></VTextField>
          </VCol>
          <VCol cols="12">
            <VTextarea v-model="editedTask.description" label="Descrição" :error-messages="formErrors.description" />
          </VCol>
          <VCol cols="6">
            <VSwitch v-model="editedTask.concluded" inset label="Concluída" color="success"></VSwitch>
          </VCol>
          <VCol cols="6" v-show="!editedTask.concluded">

            <VTextField readonly append-inner-icon="mdi-calendar" label="Data de conclusão"
              v-model="editedTask.completionDate" ref="textFieldRef">
            </VTextField>
          </VCol>
        </VRow>
      </VCardItem>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="green-darken-1" variant="text" @click="onCancel" class="px-3">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="flat" @click="onSave" class="px-3" :loading="loadingButton">
          {{ isEdition ? "Salvar Tarefa" : "Criar Tarefa" }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
<script setup lang="ts">
import { Task } from '@/interfaces/Tasks';
import { useNotificationStore } from '@/stores/notification';
import { useTaskStore } from '@/stores/task';
import { taskValidationSchema } from '@/validationSchemas/taskSchema';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';
import * as yup from 'yup';

const emit = defineEmits(['close']);

const props = defineProps<{
  task?: Task
}>();

const taskStore = useTaskStore();
const notificationsStore = useNotificationStore();

const defaultTask: Omit<Task, 'id'> = {
  title: '',
  description: '',
  concluded: true,
  completionDate: new Date()
};

const editedTask = ref({ ...defaultTask, ...props.task });

const loadingButton = ref(false);

const formErrors = ref<{ [key: string]: string }>({});

const isEdition = computed(() => {
  return !!props.task?.id;
});

const textFieldRef = ref();
const flatpickrInstance = ref();
const config = {
  enableTime: true,
  dateFormat: 'Z',
  altInput: true,
  altFormat: 'd/m/Y H:i',
  locale: Portuguese,
};
onMounted(() => {
  if (textFieldRef.value) {
    flatpickrInstance.value = flatpickr(textFieldRef.value.$el.querySelector('input'), config);
  }
});


async function onSave() {
  loadingButton.value = true;
  try {
    await validateForm();

    if (Object.keys(formErrors.value).length > 0) {
      notificationsStore.showNotification({
        show: true,
        content: "Por favor, preencha os campos como indicado antes de prosseguir!",
        color: "warning"
      });
    } else {
      isEdition.value ?
        await taskStore.editTask(editedTask.value as Task)
        :
        await taskStore.createTask(editedTask.value);

      onCancel();
    }
  } catch (error) {
    //console.error('Erro durante a submissão do formulário:', error);
  } finally {
    loadingButton.value = false;
  }
};

function onCancel() {
  emit('close');
};

watch(() => editedTask.value, validateForm, { deep: true });

async function validateForm() {
  try {
    await taskValidationSchema.validate(editedTask.value, { abortEarly: false });
    formErrors.value = {};
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      formErrors.value = error.inner.reduce((errors: any, validationError) => {
        if (validationError.path) {
          errors[validationError.path] = validationError.message;
        }
        return errors;
      }, {});
    }
  }
};
</script>