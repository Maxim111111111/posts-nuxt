<template>
  <article class="post-card">
    <h2 class="post-card__title">{{ post.title }}</h2>
    <p class="post-card__description">{{ post.description }}</p>
    <div class="post-card__footer">
      <span class="post-card__date">{{ formatDate(post.createdAt) }}</span>
      <div class="post-card__actions">
        <NuxtLink
          :to="`/posts/${post.id}`"
          class="post-card__button post-card__button--primary"
        >
          Читать
        </NuxtLink>
        <NuxtLink
          v-if="showEditButton"
          :to="`/posts/${post.id}/edit`"
          class="post-card__button post-card__button--secondary"
        >
          Редактировать
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Post {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

const props = defineProps<{
  post: Post;
  showEditButton?: boolean;
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style lang="scss">
.post-card {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &__title {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    color: #333;
  }

  &__description {
    margin: 0 0 1.5rem;
    color: #666;
    line-height: 1.6;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  &__date {
    color: #888;
    font-size: 0.9rem;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
  }

  &__button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.3s;

    &--primary {
      background-color: #007bff;
      color: white;

      &:hover {
        background-color: #0056b3;
      }
    }

    &--secondary {
      background-color: #e9ecef;
      color: #495057;

      &:hover {
        background-color: #dee2e6;
      }
    }
  }
}

@media (max-width: 768px) {
  .post-card {
    &__footer {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    &__actions {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
