<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">Добро пожаловать в наш блог</h1>
        <p class="hero__description">
          Здесь вы найдете интересные статьи на различные темы. Присоединяйтесь
          к нашему сообществу!
        </p>
        <NuxtLink to="/posts" class="hero__button"> Читать посты </NuxtLink>
      </div>
    </section>

    <section class="latest-posts">
      <h2 class="latest-posts__title">Последние публикации</h2>

      <div v-if="isLoading" class="latest-posts__loading">
        Загрузка постов...
      </div>

      <div v-else-if="error" class="latest-posts__error">
        {{ error }}
      </div>

      <div v-else-if="!posts.length" class="latest-posts__empty">
        Пока нет ни одного поста. Будьте первым, кто опубликует статью!
      </div>

      <div v-else class="posts-grid">
        <article v-for="post in posts" :key="post.id" class="post-card">
          <NuxtLink :to="`/posts/${post.id}`" class="post-card__link">
            <h3 class="post-card__title">{{ post.title }}</h3>
            <p class="post-card__excerpt">
              {{ truncateText(post.content, 150) }}
            </p>
            <div class="post-card__meta">
              <span class="post-card__date">{{
                formatDate(post.createdAt)
              }}</span>
              <span v-if="post.author" class="post-card__author">
                {{ post.author }}
              </span>
            </div>
          </NuxtLink>
        </article>
      </div>

      <div class="latest-posts__action" v-if="posts.length">
        <NuxtLink to="/posts" class="latest-posts__more">
          Смотреть все посты
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const posts = ref<any[]>([]);
const isLoading = ref(true);
const error = ref("");

const fetchLatestPosts = async () => {
  try {
    const response = await fetch(
      "http://localhost:3001/posts?_sort=createdAt&_order=desc&_limit=3"
    );

    if (!response.ok) throw new Error("Не удалось загрузить посты");

    posts.value = await response.json();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Ошибка при загрузке постов";
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
};

onMounted(() => {
  fetchLatestPosts();
});

// Добавляем метаданные для SEO
useHead({
  title: "Главная - Блог",
  meta: [
    {
      name: "description",
      content:
        "Добро пожаловать в наш блог! Читайте интересные статьи на различные темы.",
    },
  ],
});
</script>

<style lang="scss">
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 0 0 8px 8px;
  margin-bottom: 4rem;

  &__content {
    max-width: 800px;
    margin: 0 auto;
  }

  &__title {
    font-size: 3rem;
    margin: 0 0 1rem;
    line-height: 1.2;
  }

  &__description {
    font-size: 1.25rem;
    margin: 0 0 2rem;
    opacity: 0.9;
  }

  &__button {
    display: inline-block;
    padding: 1rem 2rem;
    background-color: white;
    color: #007bff;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

.latest-posts {
  padding: 0 2rem 4rem;

  &__title {
    font-size: 2rem;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
  }

  &__loading,
  &__error,
  &__empty {
    text-align: center;
    padding: 3rem;
    background: #f8f9fa;
    border-radius: 8px;
    color: #666;
  }

  &__error {
    color: #dc3545;
  }

  &__action {
    text-align: center;
    margin-top: 2rem;
  }

  &__more {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &__link {
    display: block;
    padding: 1.5rem;
    text-decoration: none;
    color: inherit;
  }

  &__title {
    font-size: 1.5rem;
    color: #333;
    margin: 0 0 1rem;
    line-height: 1.3;
  }

  &__excerpt {
    color: #666;
    margin: 0 0 1rem;
    line-height: 1.5;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    color: #999;
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 3rem 1rem;

    &__title {
      font-size: 2rem;
    }

    &__description {
      font-size: 1.1rem;
    }
  }

  .latest-posts {
    padding: 0 1rem 3rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
