import api from "@/api/apiMock";
import { LoginFormData } from "@/interfaces/formData/Login";
import { defineStore } from "pinia";
import { useNotificationStore } from "./notification";
import { Task } from "@/interfaces/Tasks";
import { SearchTaskFormData } from "@/interfaces/formData/SearchTask";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [] as Task[],
    total: 0,
    notificationStore: useNotificationStore(),
  }),

  actions: {
    async fetchTasks(
      filters: SearchTaskFormData,
      pagination = { page: 1, itemsPerPage: 5 }
    ) {
      try {
        const params = { ...filters, ...pagination };
        const response = await api.get("/tasks", { params: params });
        this.tasks = response.data.tasks;
        this.total = response.data.total;
      } catch (error) {
        this.notificationStore.snackbar = {
          show: true,
          color: "error",
          content:
            "Ocorreu um erro ao carregar as tarefas. Por favor, tente novamente mais tarde.",
          timeout: 5000,
        };
      }
    },
    async editTask(task: Task) {
      try {
        await api.put(`/task/${task.id}`, { data: task });
        const index = this.tasks.findIndex((t) => t.id == task.id);
        this.tasks[index] = task;
        this.notificationStore.snackbar = {
          show: true,
          color: "success",
          content: "Tarefa editada com sucesso.",
        };
      } catch (error) {
        this.notificationStore.snackbar = {
          show: true,
          color: "error",
          content: "Ocorreu um erro ao salvar a tarefa.",
        };
      }
    },
    async createTask(task: Omit<Task, "id">) {
      try {
        const response = await api.post("/task", { data: task });
        this.tasks.push(response.data.task);
        this.notificationStore.snackbar = {
          show: true,
          color: "success",
          content: "Tarefa criada com sucesso.",
        };
      } catch (error) {
        this.notificationStore.snackbar = {
          show: true,
          color: "error",
          content: "Ocorreu um erro ao salvar a tarefa.",
        };
      }
    },
  },

  getters: {
    filteredTasks: (state) => state.tasks,
  },
});
