<template>
  <div class="layout">
    <header class="header">
      <nav class="nav">
        <a href="/" class="nav__logo" @click.prevent="navigateTo('/')">
          Блог
        </a>

        <div class="nav__links">
          <a
            href="/"
            class="nav__link"
            :class="{ 'nav__link--active': route.path === '/' }"
            @click.prevent="navigateTo('/')"
          >
            Главная
          </a>
          <a
            href="/posts"
            class="nav__link"
            :class="{
              'nav__link--active':
                route.path.startsWith('/posts') &&
                route.path !== '/posts/create',
            }"
            @click.prevent="navigateTo('/posts')"
          >
            Все посты
          </a>
          <a
            href="/posts/create"
            class="nav__link nav__link--create"
            :class="{ 'nav__link--active': route.path === '/posts/create' }"
            @click.prevent="navigateTo('/posts/create')"
          >
            Создать пост
          </a>
        </div>

        <div class="nav__auth">
          <template v-if="isAuthenticated">
            <a
              href="/profile"
              class="nav__link"
              :class="{ 'nav__link--active': route.path === '/profile' }"
              @click.prevent="navigateTo('/profile')"
            >
              Профиль
            </a>
            <button @click="handleLogout" class="nav__button">Выйти</button>
          </template>
          <template v-else>
            <a
              href="/auth/login"
              class="nav__link"
              :class="{ 'nav__link--active': route.path === '/auth/login' }"
              @click.prevent="navigateTo('/auth/login')"
            >
              Войти
            </a>
            <a
              href="/auth/register"
              class="nav__button"
              @click.prevent="navigateTo('/auth/register')"
            >
              Регистрация
            </a>
          </template>
        </div>
      </nav>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <p class="footer__text">
        © {{ new Date().getFullYear() }} Блог. Все права защищены.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

// В реальном приложении эти значения должны приходить из хранилища состояния
const isAuthenticated = ref(true);

const handleLogout = () => {
  // Здесь должна быть логика выхода из системы
  console.log("Выход из системы");
  navigateTo("/auth/login");
};
</script>

<style lang="scss">
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #0056b3;
    }
  }

  &__links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  &__link {
    color: #333;
    text-decoration: none;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      color: #007bff;
    }

    &--active {
      color: #007bff;
      font-weight: 500;
      background-color: rgba(0, 123, 255, 0.1);
    }

    &--exact-active {
      color: #007bff;
      font-weight: 500;
      background-color: rgba(0, 123, 255, 0.1);
    }

    &--create {
      color: #007bff;
      font-weight: 500;

      &:hover {
        color: #0056b3;
      }
    }
  }

  &__auth {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  &__button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
}

.main {
  flex: 1;
  background-color: #f8f9fa;
}

.footer {
  background-color: white;
  padding: 2rem;
  text-align: center;
  border-top: 1px solid #eee;

  &__text {
    color: #666;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;

    &__links {
      flex-direction: column;
      width: 100%;
    }

    &__link {
      width: 100%;
      text-align: center;
      padding: 0.75rem;
    }

    &__auth {
      flex-direction: column;
      width: 100%;
    }

    &__button {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
