<template>
  <template v-if="taskStore.total > 0">
    <VTable fixed-header>
      <thead>
        <tr>
          <th>Título</th>
          <th>Descrição</th>
          <th>Concluído</th>
          <th>Data de conclusão</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in taskStore.filteredTasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>
            <VChip variant="outlined" :color="task.concluded ? 'success' : 'error'"> {{ task.concluded ? 'Sim' : 'Não'
              }}</VChip>
          </td>
          <td>{{ formatDate(task.completionDate) }}</td>
          <td style="margin-left: -10px">
            <VBtn icon="mdi-pencil-outline" variant="text" size="small" color="success" @click="setTaskToEdit(task)" />
            <VBtn icon="mdi-eye-outline" variant="text" size="small" @click="setShowTask(task)" />
            <VBtn v-if="!task.concluded" icon="mdi-check-outline" variant="text" size="small" color="success"
              @click="concludedTask(task)" />
          </td>
        </tr>
      </tbody>
    </VTable>
    <VPagination v-model="page" :length="pageCount" class="my-4"></VPagination>
  </template>
  <v-alert v-else type="info" color="primary" border="start" variant="tonal" title="Nenhuma tarefa encontrada!"
    class="mt-4" />
  <TaskEditModal :task="selectedTask" v-if="showModal" @close="clearTaskToEdit" />
  <Dialog @confirm="onConcludedTask" @cancel="cancelDialog" :show="showDialog" />
  <TaskCardModal :task="selectedTask" v-if="showTask" @close="closeShowTask" />
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/task';
import TaskEditModal from './TaskEditModal.vue';
import { Task } from '@/interfaces/Tasks';
import formatDate from '@/utils/utils';
import Dialog from './Dialog.vue';
import TaskCardModal from './TaskCardModal.vue';

const taskStore = useTaskStore();
const selectedTask = ref();
const showModal = ref(false);
const showDialog = ref(false);
const showTask = ref(false);

const page = ref(1);
const itemsPerPage = ref(5);
const pageCount = computed(() => Math.ceil(taskStore.total / itemsPerPage.value));

function setTaskToEdit(task: Task) {
  selectedTask.value = task;
  showModal.value = true;
}

function clearTaskToEdit() {
  showModal.value = false;
  selectedTask.value = null;
}

watch(page, fetchTasks);

function fetchTasks() {
  taskStore.fetchTasks(
    { inputFilter: null, concludedFilter: null },
    { page: page.value, itemsPerPage: itemsPerPage.value }
  );
}

function concludedTask(task: Task) {
  showDialog.value = true;
  selectedTask.value = task;
}

async function onConcludedTask() {
  selectedTask.value.completionDate = new Date();
  selectedTask.value.concluded = true;
  await taskStore.editTask(selectedTask.value);
  cancelDialog();
}

function cancelDialog() {
  showDialog.value = false;
  selectedTask.value = null;
}

function setShowTask(task: Task) {
  selectedTask.value = task;
  showTask.value = true;
}

function closeShowTask() {
  showTask.value = false;
  selectedTask.value = null;
}
</script>