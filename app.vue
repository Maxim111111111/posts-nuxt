<template>
  <div>
    <header class="header">
      <div class="header__container">
        <nav class="nav">
          <NuxtLink to="/" class="nav__link">Главная</NuxtLink>
          <NuxtLink to="/posts" class="nav__link">Посты</NuxtLink>
        </nav>
        <div class="auth-buttons">
          <template v-if="isAuthenticated">
            <NuxtLink to="/profile" class="auth-btn auth-btn--profile"
              >Профиль</NuxtLink
            >
            <button @click="logout" class="auth-btn auth-btn--logout">
              Выйти
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="auth-btn auth-btn--login"
              >Войти</NuxtLink
            >
            <NuxtLink to="/auth/register" class="auth-btn auth-btn--register"
              >Регистрация</NuxtLink
            >
          </template>
        </div>
      </div>
    </header>
    <main class="main">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
// Импортируем стили для подсветки синтаксиса
import "highlight.js/styles/github.css";

// Состояние авторизации (в реальном приложении вы бы загружали это из хранилища)
const isAuthenticated = ref(false);

// Функция для выхода из аккаунта
const logout = () => {
  // В реальном приложении здесь был бы код для разлогинивания
  isAuthenticated.value = false;
  // И перенаправление на главную страницу
  navigateTo("/");
};

// Для тестирования - установите true, чтобы увидеть состояние "авторизован"
// isAuthenticated.value = true;

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

.header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav {
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

.auth-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.auth-btn {
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.auth-btn--login {
  background-color: white;
  color: #2196f3;
}

.auth-btn--login:hover {
  background-color: #f5f5f5;
}

.auth-btn--register {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.auth-btn--register:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.auth-btn--forgot {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  padding: 6px 8px;
}

.auth-btn--forgot:hover {
  color: white;
  text-decoration: underline;
}

.auth-btn--profile {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.auth-btn--profile:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.auth-btn--logout {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.auth-btn--logout:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.main {
  padding: 20px 0;
}

/* Медиа-запросы для адаптивности */
@media (max-width: 768px) {
  .header__container {
    flex-direction: column;
    gap: 15px;
  }

  .nav {
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .auth-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }

  .auth-btn--forgot {
    width: 100%;
    text-align: center;
    margin-top: 8px;
  }
}

/* Стили для Markdown */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content h1 {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-content h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-content h3 {
  font-size: 1.25em;
}

.markdown-content p {
  margin-bottom: 1em;
}

.markdown-content ul,
.markdown-content ol {
  padding-left: 2em;
  margin-bottom: 1em;
}

.markdown-content blockquote {
  margin: 0 0 1em;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.markdown-content pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
  margin-bottom: 1em;
}

.markdown-content code {
  font-family:
    "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
  margin: 0;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
}

.markdown-content pre code {
  padding: 0;
  margin: 0;
  background-color: transparent;
  border-radius: 0;
}

.markdown-content img {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
}
</style>
