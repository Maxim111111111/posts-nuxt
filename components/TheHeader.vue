<template>
  <header class="header">
    <nav class="header__nav">
      <NuxtLink to="/" class="header__logo">Блог</NuxtLink>
      <div class="header__menu">
        <NuxtLink to="/" class="header__link">Главная</NuxtLink>
        <NuxtLink to="/posts" class="header__link">Все посты</NuxtLink>
        <NuxtLink to="/posts/create" class="header__link"
          >Создать пост</NuxtLink
        >
      </div>
    </nav>
  </header>
</template>

<style lang="scss">
.header {
  padding: 1rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &__nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    text-decoration: none;
  }

  &__menu {
    display: flex;
    gap: 1.5rem;
  }

  &__link {
    color: #666;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #333;
    }

    &.router-link-active {
      color: #007bff;
    }
  }
}

@media (max-width: 768px) {
  .header {
    &__nav {
      flex-direction: column;
      gap: 1rem;
    }

    &__menu {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
