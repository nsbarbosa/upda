import { type } from '../auto-imports';
<template>
  <v-container class="fill-height">
    <VCard width="100%" title="Lista de tarefas">
      <VCardItem>
        <VBtn color="success" variant="tonal" @click="showModal = true">
          Adicionar tarefa
          <VIcon end icon="mdi-plus" />
        </VBtn>
      </VCardItem>

      <VForm @submit.prevent="handleSubmit">
        <VCardItem>
          <VRow>
            <VCol>
              <VTextField v-model="formData.inputFilter" placeholder="Digite o título ou descrição"
                prepend-inner-icon="mdi-magnify"></VTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <VSelect v-model="formData.concludedFilter" clearable label="Concluída" :items="taskConcludedItems"
                :item-title="item => item.label" :item-value="item => item.value"></VSelect>
            </VCol>
          </VRow>
        </VCardItem>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="success" variant="text" @click="clearFilters">
            Limpar Filtros
          </VBtn>
          <VBtn type="submit" color="success" variant="flat">
            Pesquisar
          </VBtn>
        </VCardActions>
      </VForm>
      <VCardItem v-if="showTable">
        <TasksTable />
      </VCardItem>
    </VCard>
    <TaskEditModal v-if="showModal" @close="showModal = false" />
  </v-container>
</template>

<script setup lang="ts">
import { SearchTaskFormData } from '@/interfaces/formData/SearchTask';
import TasksTable from '@/components/TasksTable.vue';
import { useTaskStore } from '@/stores/task';

const taskStore = useTaskStore();
const showModal = ref(false);
const formData = ref<SearchTaskFormData>({
  inputFilter: null,
  concludedFilter: null
});
const taskConcludedItems = [{
  label: 'Sim',
  value: true
},
{
  label: 'Não',
  value: false
}];
const showTable = ref(false);
const loadingButton = ref(false);

const handleSubmit = async () => {
  loadingButton.value = true;
  try {
    await taskStore.fetchTasks(formData.value);
    showTable.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    loadingButton.value = false;
  }
};

function clearFilters() {
  showTable.value = false;
  formData.value.concludedFilter = null;
  formData.value.inputFilter = null;
}
</script>
