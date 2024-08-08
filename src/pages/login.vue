<template>
  <div class="auth-wrapper d-flex align-center justify-center">
    <VCard class="pa-4" max-width="350">
      <VCardItem class="justify-center">
        <VImg :width="300" :src="imgLogin" />
      </VCardItem>

      <VCardText class="text-center pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">Entrar</h5>
        <p class="mb-0">Por favor, entre na sua conta</p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField v-model="formData.email" label="Email" type="email" :error-messages="formErrors.email" />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField v-model="formData.password" label="Password" :type="isPasswordVisible ? 'text' : 'password'"
                :error-messages="formErrors.password" :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                  " @click:append-inner="isPasswordVisible = !isPasswordVisible" />
            </VCol>
            <!-- login button -->
            <VCol cols="12">
              <VBtn block type="submit" :loading="loadingButton">
                Login
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import imgLogin from "@/assets/login.svg";
import { LoginFormData } from "@/interfaces/formData/Login";
import { loginValidationSchema } from "@/validationSchemas/loginSchema";
import { useNotificationStore } from "@/stores/notification";
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';

const notificationsStore = useNotificationStore();
const authStore = useAuthStore();

const loadingButton = ref(false);
const isPasswordVisible = ref(false);

const formData = ref<LoginFormData>({
  email: "",
  password: "",
});

const formErrors = ref<{ [key: string]: string }>({});

async function validateForm() {
  try {
    await loginValidationSchema.validate(formData.value, { abortEarly: false });
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

const handleSubmit = async () => {
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
      await authStore.login(formData.value);
    }
  } catch (error) {
    //console.error('Erro durante a submissão do formulário:', error);
  } finally {
    loadingButton.value = false;
  }
};

watch(() => formData.value, validateForm, { deep: true });

</script>

<route lang="yaml">
meta:
  layout: blank
</route>