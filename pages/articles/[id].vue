<template>
  <div class="article-page">
    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="error" class="error">
      {{ error }}
      <NuxtLink to="/articles" class="back-link">
        Вернуться к списку статей
      </NuxtLink>
    </div>

    <template v-else>
      <div class="article-header">
        <h1>{{ article.title }}</h1>

        <div class="article-meta">
          <span class="article-date">{{ formatDate(article.createdAt) }}</span>
          <span class="article-author">{{
            article.author?.name || "Автор не указан"
          }}</span>
        </div>
      </div>

      <div v-if="article.preview" class="article-preview">
        <img :src="article.preview" :alt="article.title" />
      </div>

      <div class="article-content" v-html="article.content"></div>

      <div
        v-if="article.attachments && article.attachments.length > 0"
        class="article-attachments"
      >
        <h3>Вложения:</h3>
        <ul>
          <li v-for="attachment in article.attachments" :key="attachment._id">
            <a :href="attachment.url" target="_blank" rel="noopener noreferrer">
              {{ attachment.name }}
            </a>
          </li>
        </ul>
      </div>

      <NuxtLink to="/articles" class="back-link">
        Вернуться к списку статей
      </NuxtLink>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { $api } = useNuxtApp();
const article = ref({});
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

// Загрузка статьи при монтировании компонента
onMounted(async () => {
  try {
    loading.value = true;

    // Пробуем загрузить через прямой API-маршрут
    try {
      const response = await fetch(`/api/direct-article/${route.params.id}`);
      if (!response.ok) {
        throw new Error(`Ошибка при загрузке статьи: ${response.status}`);
      }
      article.value = await response.json();
      console.log("Статья загружена через прямой API-маршрут");
      return;
    } catch (directError) {
      console.error(
        "Ошибка при загрузке через прямой API-маршрут:",
        directError
      );
    }

    // Пробуем загрузить статью
    try {
      article.value = await $api.articles.getById(route.params.id);
      console.log("Статья загружена через /articles");
    } catch (articlesError) {
      console.error("Ошибка при загрузке через /articles:", articlesError);

      // Если не получилось, пробуем загрузить пост
      try {
        article.value = await $api.posts.getById(route.params.id);
        console.log("Статья загружена через /posts");
      } catch (postsError) {
        console.error("Ошибка при загрузке через /posts:", postsError);
        throw new Error(
          "Не удалось загрузить статью ни через один из доступных путей"
        );
      }
    }
  } catch (err) {
    error.value = `Ошибка при загрузке статьи: ${err.message}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.article-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 40px 0;
  font-size: 18px;
}

.error {
  color: #e53935;
}

.article-header {
  margin-bottom: 30px;
}

h1 {
  font-size: 32px;
  margin-bottom: 15px;
}

.article-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.article-preview {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.article-preview img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}

.article-content {
  font-size: 18px;
  line-height: 1.7;
  color: #333;
}

.article-content p {
  margin-bottom: 20px;
}

.article-attachments {
  margin-top: 40px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.article-attachments h3 {
  margin-bottom: 15px;
  font-size: 20px;
}

.article-attachments ul {
  list-style: none;
  padding: 0;
}

.article-attachments li {
  margin-bottom: 10px;
}

.article-attachments a {
  color: #2196f3;
  text-decoration: none;
  font-weight: 500;
}

.article-attachments a:hover {
  text-decoration: underline;
}

.back-link {
  display: inline-block;
  margin-top: 40px;
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #1976d2;
}
</style>
