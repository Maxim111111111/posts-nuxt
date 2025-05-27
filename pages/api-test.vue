<template>
  <div class="api-test">
    <h1>Тест API</h1>

    <div class="api-section">
      <h2>Тест API эндпоинтов</h2>
      <div class="api-buttons">
        <button @click="testPosts" class="btn">Тест /api/posts</button>
        <button @click="testArticles" class="btn">Тест /api/articles</button>
        <button @click="testBlog" class="btn">Тест /api/blog</button>
      </div>
    </div>

    <div class="api-section">
      <h2>Тест диагностических эндпоинтов</h2>
      <div class="api-buttons">
        <button @click="testApiTest" class="btn">Тест /api/test</button>
        <button @click="testDockerTest" class="btn">
          Тест Docker /api/docker-test
        </button>
        <button @click="testNetworkTest" class="btn">Тест сети /api/network-test</button>
      </div>
    </div>

    <div class="api-section">
      <h2>Тест Docker-прокси</h2>
      <div class="api-buttons">
        <button @click="testDockerProxyPosts" class="btn">Docker-прокси /posts</button>
        <button @click="testDockerProxyArticles" class="btn">Docker-прокси /articles</button>
        <button @click="testDirectDockerPosts" class="btn">Прямой Docker /posts</button>
        <button @click="testDirectDockerArticles" class="btn">Прямой Docker /articles</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-if="error" class="error">
      <h3>Ошибка:</h3>
      <pre>{{ error }}</pre>
    </div>

    <div v-if="result" class="result">
      <h3>Результат:</h3>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const loading = ref(false);
const error = ref(null);
const result = ref(null);

async function makeApiRequest(endpoint) {
  loading.value = true;
  error.value = null;
  result.value = null;

  try {
    const response = await fetch(`/api/${endpoint}`);
    console.log(`Статус ответа для /api/${endpoint}:`, response.status);

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }

    result.value = await response.json();
  } catch (err) {
    console.error("Ошибка запроса:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

const testPosts = () => makeApiRequest("posts");
const testArticles = () => makeApiRequest("articles");
const testBlog = () => makeApiRequest("blog");
const testApiTest = () => makeApiRequest("test");
const testDockerTest = () => makeApiRequest("docker-test");
const testNetworkTest = () => makeApiRequest("network-test");
const testDockerProxyPosts = () => makeApiRequest("docker-proxy/posts");
const testDockerProxyArticles = () => makeApiRequest("docker-proxy/articles");
const testDirectDockerPosts = () => makeApiRequest("direct-docker/posts");
const testDirectDockerArticles = () => makeApiRequest("direct-docker/articles");
</script>

<style scoped>
.api-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.api-section {
  margin-bottom: 20px;
}

.api-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #2980b9;
}

.loading {
  margin: 20px 0;
  font-style: italic;
}

.error {
  margin: 20px 0;
  padding: 10px;
  background-color: #ffeeee;
  border: 1px solid #ffcccc;
  border-radius: 4px;
}

.result {
  margin: 20px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  overflow: auto;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
