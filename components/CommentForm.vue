<template>
  <form @submit.prevent="handleSubmit" class="comment-form">
    <div class="comment-form__group">
      <label for="comment" class="comment-form__label">Ваш комментарий</label>
      <textarea
        id="comment"
        v-model="text"
        class="comment-form__textarea"
        required
        :disabled="isSubmitting"
      ></textarea>
    </div>

    <button
      type="submit"
      class="comment-form__button"
      :disabled="isSubmitting || !text.trim()"
    >
      {{ isSubmitting ? "Отправка..." : "Отправить комментарий" }}
    </button>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "submit", comment: { text: string }): void;
}>();

const text = ref("");
const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (isSubmitting.value || !text.value.trim()) return;

  isSubmitting.value = true;
  try {
    emit("submit", { text: text.value });
    text.value = "";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss">
.comment-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  &__group {
    margin-bottom: 1rem;
  }

  &__label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
  }

  &__textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    min-height: 100px;
    resize: vertical;
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
