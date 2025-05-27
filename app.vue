<template>
  <div>
    <header class="header">
      <nav class="nav">
        <NuxtLink to="/" class="nav__link">Главная</NuxtLink>
        <NuxtLink to="/articles" class="nav__link">Статьи</NuxtLink>
        <NuxtLink to="/api-test" class="nav__link">Тест API</NuxtLink>
      </nav>
    </header>
    <main class="main">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: "%s - Блог",
});
</script>

<style>
html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

img {
  max-width: 100%;
  height: auto;
}

button {
  font: inherit;
}

.header {
  background-color: #2196f3;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
}

.nav__link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav__link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav__link--active,
.nav__link--exact-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.main {
  padding: 20px 0;
}
</style>
