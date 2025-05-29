<template>
  <div class="posts-page">
    <div class="posts-page__header">
      <h1 class="posts-page__title">Все посты</h1>
      <NuxtLink to="/posts/create" class="posts-page__create-btn">
        Создать пост
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="posts-page__loading">Загрузка постов...</div>

    <div v-else-if="error" class="posts-page__error">
      {{ error }}
    </div>

    <div v-else-if="!posts.length" class="posts-page__empty">
      Пока нет ни одного поста. Создайте первый!
    </div>

    <template v-else>
      <div class="posts-grid">
        <article v-for="post in posts" :key="post.id" class="post-card">
          <NuxtLink :to="`/posts/${post.id}`" class="post-card__link">
            <h2 class="post-card__title">{{ post.title }}</h2>
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

      <div class="pagination" v-if="totalPages > 1">
        <button
          class="pagination__btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          Предыдущая
        </button>

        <span class="pagination__info">
          Страница {{ currentPage }} из {{ totalPages }}
        </span>

        <button
          class="pagination__btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Следующая
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const POSTS_PER_PAGE = 6;

const posts = ref<any[]>([]);
const isLoading = ref(true);
const error = ref("");
const currentPage = ref(1);
const totalPages = ref(0);

const route = useRoute();
const router = useRouter();

const fetchPosts = async (page: number) => {
  try {
    const response = await fetch(
      `http://localhost:3001/posts?_page=${page}&_limit=${POSTS_PER_PAGE}&_sort=createdAt&_order=desc`
    );

    if (!response.ok) throw new Error("Не удалось загрузить посты");

    const totalCount = response.headers.get("X-Total-Count");
    if (totalCount) {
      totalPages.value = Math.ceil(parseInt(totalCount) / POSTS_PER_PAGE);
    }

    posts.value = await response.json();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Ошибка при загрузке постов";
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  router.push({ query: { page: page.toString() } });
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

watch(
  () => route.query.page,
  (newPage) => {
    const page = parseInt(newPage as string) || 1;
    currentPage.value = page;
    fetchPosts(page);
  },
  { immediate: true }
);

// Добавляем метаданные для SEO
useHead({
  title: "Все посты",
  meta: [
    {
      name: "description",
      content: "Список всех постов в блоге",
    },
  ],
});
</script>

<style lang="scss">
.posts-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 2rem;
    color: #333;
    margin: 0;
  }

  &__create-btn {
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
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  font-size: 0.8rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &__link {
    display: block;
    padding: 0.75rem;
    text-decoration: none;
    color: inherit;
  }

  &__title {
    font-size: 1rem;
    color: #333;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }

  &__excerpt {
    color: #666;
    margin: 0 0 0.5rem;
    line-height: 1.3;
    font-size: 0.8rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    color: #999;
    font-size: 0.7rem;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;

  &__btn {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
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

  &__info {
    color: #666;
  }
}

@media (min-width: 576px) {
  .posts-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}

@media (min-width: 768px) {
  .posts-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .post-card {
    &__link {
      padding: 1.2rem;
    }

    &__title {
      font-size: 1.3rem;
      margin: 0 0 0.8rem;
    }

    &__excerpt {
      font-size: 0.95rem;
      margin: 0 0 0.8rem;
    }

    &__meta {
      font-size: 0.8rem;
    }
  }
}

@media (min-width: 992px) {
  .posts-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .post-card {
    &__link {
      padding: 1.5rem;
    }

    &__title {
      font-size: 1.5rem;
      margin: 0 0 1rem;
    }

    &__excerpt {
      font-size: 1rem;
      margin: 0 0 1rem;
    }

    &__meta {
      font-size: 0.875rem;
    }
  }
}

@media (max-width: 768px) {
  .posts-page {
    padding: 1rem;

    &__header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }

  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
