import { SnackbarNotification } from "@/interfaces/Notifications";
import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    snackbar: {} as SnackbarNotification,
  }),

  actions: {
    async showNotification(notification: SnackbarNotification) {
      this.snackbar = notification;
      setTimeout(() => {
        this.snackbar.show = false;
      }, 4000);
    },
  },
});
