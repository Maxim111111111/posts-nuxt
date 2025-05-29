<template>
  <div class="articles-list">
    <h2>Статьи</h2>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="articles.length === 0" class="no-articles">
      Статьи не найдены
    </div>

    <div v-else class="articles-grid">
      <div v-for="article in articles" :key="article._id" class="article-card">
        <img
          v-if="article.preview"
          :src="article.preview"
          alt="Превью"
          class="article-preview"
        />
        <div v-else class="article-preview-placeholder">Нет изображения</div>

        <h3 class="article-title">{{ article.title }}</h3>
        <p class="article-excerpt">{{ article.excerpt }}</p>

        <div class="article-meta">
          <span class="article-date">{{ formatDate(article.createdAt) }}</span>
          <span class="article-author">{{
            article.author?.name || "Автор не указан"
          }}</span>
        </div>

        <NuxtLink :to="`/articles/${article._id}`" class="article-link">
          Читать далее
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const { $api } = useNuxtApp();
const articles = ref([]);
const loading = ref(true);
const error = ref(null);

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

// Загрузка статей при монтировании компонента
onMounted(async () => {
  try {
    loading.value = true;

    // Пробуем загрузить через прямой API-маршрут
    try {
      const response = await fetch("/api/direct-articles");
      if (!response.ok) {
        throw new Error(`Ошибка при загрузке статей: ${response.status}`);
      }
      articles.value = await response.json();
      console.log("Статьи загружены через прямой API-маршрут");
      return;
    } catch (directError) {
      console.error(
        "Ошибка при загрузке через прямой API-маршрут:",
        directError
      );
    }

    // Пробуем загрузить статьи
    try {
      articles.value = await $api.articles.getAll();
      console.log("Статьи загружены через /articles");
    } catch (articlesError) {
      console.error("Ошибка при загрузке через /articles:", articlesError);

      // Если не получилось, пробуем загрузить посты
      try {
        articles.value = await $api.posts.getAll();
        console.log("Статьи загружены через /posts");
      } catch (postsError) {
        console.error("Ошибка при загрузке через /posts:", postsError);
        throw new Error(
          "Не удалось загрузить статьи ни через один из доступных путей"
        );
      }
    }
  } catch (err) {
    error.value = `Ошибка при загрузке статей: ${err.message}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.articles-list {
  padding: 20px 0;
}

.loading,
.error,
.no-articles {
  text-align: center;
  padding: 40px 0;
  font-size: 18px;
}

.error {
  color: #e53935;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

.article-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  background: #fff;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.article-preview,
.article-preview-placeholder {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.article-title {
  font-size: 20px;
  margin: 15px 15px 10px;
  line-height: 1.3;
}

.article-excerpt {
  margin: 0 15px 15px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  margin: 0 15px;
  font-size: 12px;
  color: #888;
}

.article-link {
  display: block;
  text-align: center;
  margin: 15px;
  padding: 8px 0;
  background-color: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.article-link:hover {
  background-color: #1976d2;
}
</style>
