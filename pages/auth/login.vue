<template>
  <div class="auth-page">
    <h1 class="auth-page__title">Вход в систему</h1>
    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="auth-form__group">
        <label for="email" class="auth-form__label">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="auth-form__input"
          required
          :disabled="isSubmitting"
        />
      </div>

      <div class="auth-form__group">
        <label for="password" class="auth-form__label">Пароль</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="auth-form__input"
          required
          :disabled="isSubmitting"
        />
      </div>

      <div class="auth-form__links">
        <NuxtLink to="/auth/forgot" class="auth-form__link"
          >Забыли пароль?</NuxtLink
        >
        <NuxtLink to="/auth/register" class="auth-form__link"
          >Регистрация</NuxtLink
        >
      </div>

      <button type="submit" class="auth-form__button" :disabled="isSubmitting">
        {{ isSubmitting ? "Вход..." : "Войти" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const isSubmitting = ref(false);

const handleLogin = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    // TODO: Реализовать логику входа через API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Имитация запроса
    router.push("/");
  } catch (error) {
    alert("Ошибка при входе");
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: "Вход - Блог",
  meta: [
    {
      name: "description",
      content: "Страница входа в блог",
    },
  ],
});
</script>

<style lang="scss">
.auth-page {
  max-width: 400px;
  margin: 2rem auto;
  padding: 0 1rem;

  &__title {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &__group {
    margin-bottom: 1.5rem;
  }

  &__label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }

  &__input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #007bff;
    }

    &:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
    }
  }

  &__links {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  &__link {
    color: #007bff;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }

  &__button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover:not(:disabled) {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>
