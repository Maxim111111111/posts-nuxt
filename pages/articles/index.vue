<template>
  <div class="articles-page">
    <h1>Блог</h1>
    <ArticlesList />
  </div>
</template>

<script setup>
definePageMeta({
  title: "Статьи",
});
</script>

<style scoped>
.articles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  font-size: 32px;
  text-align: center;
}
</style>
