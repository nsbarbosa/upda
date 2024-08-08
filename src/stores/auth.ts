import api from "@/api/apiMock";
import { LoginFormData } from "@/interfaces/formData/Login";
import axios from "axios";
import { defineStore } from "pinia";
import { useNotificationStore } from "./notification";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    notificationStore: useNotificationStore(),
  }),

  actions: {
    async login(login: LoginFormData) {
      try {
        const response = await api.post("/login", login);
        this.user = response.data.user;
        this.token = response.data.token;
        router.push("/");
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          this.notificationStore.snackbar = {
            show: true,
            color: "error",
            content: "Acesso inválido. Por favor, verifique suas credenciais.",
            timeout: 5000,
          };
        } else {
          this.notificationStore.snackbar = {
            show: true,
            color: "error",
            content:
              "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.",
            timeout: 5000,
          };
        }
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
