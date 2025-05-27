<template>
  <div class="comments">
    <h3 class="comments__title">Комментарии ({{ comments.length }})</h3>

    <div v-if="isLoading" class="comments__loading">
      Загрузка комментариев...
    </div>

    <div v-else-if="error" class="comments__error">
      {{ error }}
    </div>

    <div v-else-if="!comments.length" class="comments__empty">
      Пока нет комментариев. Будьте первым!
    </div>

    <ul v-else class="comments__list">
      <li v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment__header">
          <span class="comment__author">{{
            comment.author || "Анонимный пользователь"
          }}</span>
          <span class="comment__date">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <p class="comment__text">{{ comment.text }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Comment {
  id: number;
  text: string;
  author?: string;
  createdAt: string;
}

const props = defineProps<{
  comments: Comment[];
  isLoading?: boolean;
  error?: string;
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style lang="scss">
.comments {
  margin-top: 2rem;

  &__title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #333;
  }

  &__loading,
  &__error,
  &__empty {
    text-align: center;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
    color: #666;
  }

  &__error {
    color: #dc3545;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}

.comment {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  &__author {
    font-weight: 500;
    color: #333;
  }

  &__date {
    font-size: 0.875rem;
    color: #666;
  }

  &__text {
    margin: 0;
    line-height: 1.5;
    color: #444;
  }
}
</style>
