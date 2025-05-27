<template>
  <div class="create-post">
    <h1 class="create-post__title">Создание нового поста</h1>

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
          placeholder="Введите заголовок поста"
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
          placeholder="Введите содержание поста"
        ></textarea>
      </div>

      <div class="post-form__actions">
        <button
          type="submit"
          class="post-form__submit"
          :disabled="isSaving || !isFormValid"
        >
          {{ isSaving ? "Создание..." : "Создать пост" }}
        </button>
        <NuxtLink to="/posts" class="post-form__cancel"> Отмена </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const isSaving = ref(false);

const form = ref({
  title: "",
  content: "",
});

const isFormValid = computed(() => {
  return form.value.title.trim() && form.value.content.trim();
});

const handleSubmit = async () => {
  if (isSaving.value || !isFormValid.value) return;

  isSaving.value = true;
  try {
    const response = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error("Не удалось создать пост");

    const newPost = await response.json();
    router.push(`/posts/${newPost.id}`);
  } catch (e) {
    alert(e instanceof Error ? e.message : "Ошибка при создании поста");
  } finally {
    isSaving.value = false;
  }
};

// Добавляем метаданные для SEO
useHead({
  title: "Создание нового поста",
  meta: [
    {
      name: "description",
      content: "Страница создания нового поста в блоге",
    },
  ],
});
</script>

<style lang="scss">
.create-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

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

    &::placeholder {
      color: #999;
    }

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
    flex: 1;
  }

  &__submit {
    background-color: #007bff;
    color: white;
    border: none;

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

    &:hover {
      background-color: #e9ecef;
    }
  }
}
</style>
