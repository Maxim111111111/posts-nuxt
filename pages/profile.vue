<template>
  <div class="profile">
    <h1 class="profile__title">Профиль</h1>
    <div v-if="pending">Загрузка...</div>
    <div v-else-if="error">Ошибка при загрузке профиля</div>
    <template v-else>
      <div class="profile__content">
        <form @submit.prevent="handleUpdate" class="profile-form">
          <div class="profile-form__group">
            <label for="name" class="profile-form__label">Имя</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="profile-form__input"
              required
              :disabled="isSubmitting"
            />
          </div>

          <div class="profile-form__group">
            <label for="email" class="profile-form__label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="profile-form__input"
              required
              disabled
            />
          </div>

          <div class="profile-form__group">
            <label for="currentPassword" class="profile-form__label"
              >Текущий пароль</label
            >
            <input
              id="currentPassword"
              v-model="form.currentPassword"
              type="password"
              class="profile-form__input"
              :disabled="isSubmitting"
            />
          </div>

          <div class="profile-form__group">
            <label for="newPassword" class="profile-form__label"
              >Новый пароль</label
            >
            <input
              id="newPassword"
              v-model="form.newPassword"
              type="password"
              class="profile-form__input"
              :disabled="isSubmitting"
            />
          </div>

          <div class="profile-form__actions">
            <button
              type="submit"
              class="profile-form__button profile-form__button--primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Сохранение..." : "Сохранить изменения" }}
            </button>
          </div>
        </form>

        <div class="profile__posts">
          <h2 class="profile__subtitle">Мои посты</h2>
          <div v-if="postsLoading">Загрузка постов...</div>
          <div v-else-if="postsError">Ошибка при загрузке постов</div>
          <div v-else-if="!userPosts?.length" class="profile__empty">
            У вас пока нет постов
          </div>
          <div v-else class="profile__posts-grid">
            <PostCard
              v-for="post in userPosts"
              :key="post.id"
              :post="post"
              :show-edit-button="true"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const form = ref({
  name: "",
  email: "",
  currentPassword: "",
  newPassword: "",
});

const isSubmitting = ref(false);

// Имитация загрузки данных пользователя
const {
  data: userData,
  pending,
  error,
} = await useAsyncData("user-profile", () =>
  Promise.resolve({
    name: "Тестовый пользователь",
    email: "test@example.com",
  })
);

// Имитация загрузки постов пользователя
const {
  data: userPosts,
  pending: postsLoading,
  error: postsError,
} = await useLazyAsyncData("user-posts", () =>
  $fetch("http://localhost:3001/posts?_sort=createdAt&_order=desc")
);

watch(
  userData,
  (newData) => {
    if (newData) {
      form.value.name = newData.name;
      form.value.email = newData.email;
    }
  },
  { immediate: true }
);

const handleUpdate = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    // TODO: Реализовать логику обновления профиля через API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Имитация запроса
    alert("Профиль успешно обновлен");
  } catch (error) {
    alert("Ошибка при обновлении профиля");
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: "Профиль - Блог",
  meta: [
    {
      name: "description",
      content: "Страница профиля пользователя",
    },
  ],
});
</script>

<style lang="scss">
.profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  &__title {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  &__content {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 2fr;
  }

  &__subtitle {
    margin-bottom: 1.5rem;
    color: #333;
  }

  &__empty {
    color: #666;
    font-style: italic;
  }

  &__posts-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

.profile-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;

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

  &__actions {
    margin-top: 2rem;
  }

  &__button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &--primary {
      background-color: #007bff;
      color: white;

      &:hover:not(:disabled) {
        background-color: #0056b3;
      }

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  }
}

@media (max-width: 768px) {
  .profile {
    &__content {
      grid-template-columns: 1fr;
    }
  }
}
</style>
