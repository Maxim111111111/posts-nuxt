<template>
  <div class="edit-post">
    <div v-if="isLoading" class="edit-post__loading">Загрузка поста...</div>

    <div v-else-if="error" class="edit-post__error">
      {{ error }}
    </div>

    <template v-else>
      <h1 class="edit-post__title">Редактирование поста</h1>

      <form @submit.prevent="handleSubmit" class="post-form">
        <div class="post-form__group">
          <label for="title" class="post-form__label">Заголовок</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="post-form__input"
            required
            :disabled="isSaving"
          />
        </div>

        <div class="post-form__group">
          <label for="content" class="post-form__label">Содержание</label>
          <textarea
            id="content"
            v-model="form.content"
            class="post-form__textarea"
            required
            :disabled="isSaving"
          ></textarea>
        </div>

        <div class="post-form__actions">
          <button
            type="submit"
            class="post-form__submit"
            :disabled="isSaving || !isFormValid"
          >
            {{ isSaving ? "Сохранение..." : "Сохранить изменения" }}
          </button>
          <NuxtLink :to="`/posts/${route.params.id}`" class="post-form__cancel">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const isSaving = ref(false);
const error = ref("");

const form = ref({
  title: "",
  content: "",
});

const isFormValid = computed(() => {
  return form.value.title.trim() && form.value.content.trim();
});

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:3001/posts/${route.params.id}`
    );
    if (!response.ok) throw new Error("Пост не найден");

    const post = await response.json();
    form.value = {
      title: post.title,
      content: post.content,
    };
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Ошибка при загрузке поста";
  } finally {
    isLoading.value = false;
  }
});

const handleSubmit = async () => {
  if (isSaving.value || !isFormValid.value) return;

  isSaving.value = true;
  try {
    const response = await fetch(
      `http://localhost:3001/posts/${route.params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form.value,
          updatedAt: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) throw new Error("Не удалось сохранить изменения");

    router.push(`/posts/${route.params.id}`);
  } catch (e) {
    alert(e instanceof Error ? e.message : "Ошибка при сохранении изменений");
  } finally {
    isSaving.value = false;
  }
};

// Добавляем метаданные для SEO
useHead({
  title: "Редактирование поста",
  meta: [
    {
      name: "description",
      content: "Страница редактирования поста",
    },
  ],
});
</script>

<style lang="scss">
.edit-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  &__loading,
  &__error {
    text-align: center;
    padding: 3rem;
    background: #f8f9fa;
    border-radius: 8px;
    color: #666;
  }

  &__error {
    color: #dc3545;
  }

  &__title {
    font-size: 2rem;
    color: #333;
    margin-bottom: 2rem;
  }
}

.post-form {
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

  &__input,
  &__textarea {
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

  &__textarea {
    min-height: 300px;
    resize: vertical;
  }

  &__actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  &__submit,
  &__cancel {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
  }

  &__submit {
    background-color: #007bff;
    color: white;
    border: none;
    flex: 1;

    &:hover:not(:disabled) {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  &__cancel {
    background-color: #f8f9fa;
    color: #333;
    border: 1px solid #ddd;
    text-decoration: none;
    flex: 1;

    &:hover {
      background-color: #e9ecef;
    }
  }
}
</style>
