<template>
  <div class="api-test">
    <h2>Тестирование API</h2>

    <div class="test-section">
      <h3>Проверка доступности API</h3>
      <button @click="testApiConnection" class="test-button">
        Проверить соединение
      </button>
      <div
        v-if="connectionStatus"
        :class="['status', connectionStatus.success ? 'success' : 'error']"
      >
        {{ connectionStatus.message }}
      </div>
    </div>

    <div class="test-section">
      <h3>Отладочная информация</h3>
      <button @click="testDebugEndpoint" class="test-button">
        Получить отладочную информацию
      </button>
      <div
        v-if="debugStatus"
        :class="['status', debugStatus.success ? 'success' : 'error']"
      >
        {{ debugStatus.message }}
      </div>
      <div v-if="debugResult" class="results">
        <h4>Результат:</h4>
        <pre>{{ JSON.stringify(debugResult, null, 2) }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h3>Внутренний тестовый эндпоинт</h3>
      <button @click="testInternalEndpoint" class="test-button">
        Проверить Nuxt API
      </button>
      <div
        v-if="internalStatus"
        :class="['status', internalStatus.success ? 'success' : 'error']"
      >
        {{ internalStatus.message }}
      </div>
      <div v-if="internalResult" class="results">
        <h4>Результат:</h4>
        <pre>{{ JSON.stringify(internalResult, null, 2) }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h3>Получить список статей</h3>
      <div class="form-group">
        <label for="api-path">Путь API:</label>
        <input
          type="text"
          id="api-path"
          v-model="apiPath"
          placeholder="/api/articles"
        />
      </div>
      <button @click="fetchArticles" class="test-button">
        Загрузить статьи
      </button>
      <div
        v-if="articlesStatus"
        :class="['status', articlesStatus.success ? 'success' : 'error']"
      >
        {{ articlesStatus.message }}
      </div>
      <div v-if="articles.length > 0" class="results">
        <h4>Результат ({{ articles.length }} статей):</h4>
        <pre>{{ JSON.stringify(articles, null, 2) }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h3>Проверить доступные пути</h3>
      <button @click="checkPaths" class="test-button">Проверить пути</button>
      <div v-if="pathsStatus" class="status" :class="{ info: true }">
        {{ pathsStatus }}
      </div>
      <div v-if="pathResults.length > 0" class="results">
        <h4>Результаты проверки путей:</h4>
        <div
          v-for="(result, index) in pathResults"
          :key="index"
          :class="['path-result', result.exists ? 'success' : 'error']"
        >
          <strong>{{ result.path }}</strong
          >: {{ result.status }} {{ result.exists ? "✓" : "✗" }}
        </div>
      </div>
    </div>

    <div class="test-section">
      <h3>Авторизация</h3>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="loginForm.email" />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="loginForm.password" />
      </div>
      <button @click="login" class="test-button">Войти</button>
      <div
        v-if="loginStatus"
        :class="['status', loginStatus.success ? 'success' : 'error']"
      >
        {{ loginStatus.message }}
      </div>
    </div>

    <div class="test-section">
      <h3>Получить информацию о пользователе</h3>
      <button @click="fetchUserProfile" class="test-button">
        Загрузить профиль
      </button>
      <div
        v-if="profileStatus"
        :class="['status', profileStatus.success ? 'success' : 'error']"
      >
        {{ profileStatus.message }}
      </div>
      <div v-if="userProfile" class="results">
        <h4>Результат:</h4>
        <pre>{{ JSON.stringify(userProfile, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { $api } = useNuxtApp();

const connectionStatus = ref(null);
const internalStatus = ref(null);
const debugStatus = ref(null);
const articlesStatus = ref(null);
const profileStatus = ref(null);
const loginStatus = ref(null);
const pathsStatus = ref(null);
const articles = ref([]);
const userProfile = ref(null);
const internalResult = ref(null);
const debugResult = ref(null);
const pathResults = ref([]);
const loginForm = ref({
  email: "",
  password: "",
});
const apiPath = ref("/api/articles");

// Проверка соединения с API
const testApiConnection = async () => {
  try {
    connectionStatus.value = {
      success: false,
      message: "Проверка соединения...",
    };

    // Пробуем получить Swagger документацию для проверки соединения
    await fetch("/api/swagger/index.html", { method: "GET" }).then(
      (response) => {
        if (response.ok) {
          connectionStatus.value = {
            success: true,
            message: "API доступен (Swagger UI)!",
          };
          return;
        }
        throw new Error(`Статус ответа: ${response.status}`);
      }
    );
  } catch (error) {
    console.error("Ошибка при проверке соединения:", error);

    // Пробуем другие пути
    try {
      const response = await fetch("/api/articles", { method: "GET" });
      if (response.ok) {
        connectionStatus.value = {
          success: true,
          message: "API доступен (articles endpoint)!",
        };
        return;
      }
    } catch (e) {
      // Игнорируем ошибку и пробуем дальше
    }

    try {
      const response = await fetch("/api", { method: "GET" });
      if (response.ok) {
        connectionStatus.value = {
          success: true,
          message: "API доступен по корневому пути!",
        };
        return;
      }
    } catch (e) {
      // Игнорируем ошибку и пробуем дальше
    }

    connectionStatus.value = {
      success: false,
      message: `Ошибка соединения с API. Проверьте, запущен ли API-сервер на порту 8080.`,
    };
  }
};

// Проверка отладочного эндпоинта
const testDebugEndpoint = async () => {
  try {
    debugStatus.value = {
      success: false,
      message: "Получение отладочной информации...",
    };

    const response = await fetch("/api/debug", { method: "GET" });
    if (response.ok) {
      debugResult.value = await response.json();
      debugStatus.value = {
        success: true,
        message: "Отладочная информация получена!",
      };
    } else {
      throw new Error(`Статус ответа: ${response.status}`);
    }
  } catch (error) {
    console.error("Ошибка при получении отладочной информации:", error);
    debugStatus.value = {
      success: false,
      message: `Ошибка: ${error.message}`,
    };
  }
};

// Проверка внутреннего тестового эндпоинта
const testInternalEndpoint = async () => {
  try {
    internalStatus.value = {
      success: false,
      message: "Проверка внутреннего эндпоинта...",
    };

    const response = await fetch("/api/test", { method: "GET" });
    if (response.ok) {
      internalResult.value = await response.json();
      internalStatus.value = {
        success: true,
        message: "Внутренний тестовый эндпоинт работает!",
      };
    } else {
      throw new Error(`Статус ответа: ${response.status}`);
    }
  } catch (error) {
    console.error("Ошибка при проверке внутреннего эндпоинта:", error);
    internalStatus.value = {
      success: false,
      message: `Ошибка: ${error.message}`,
    };
  }
};

// Получение статей
const fetchArticles = async () => {
  try {
    articlesStatus.value = { success: false, message: "Загрузка статей..." };

    // Прямой запрос к API для отладки
    const path = apiPath.value || "/api/articles";
    console.log("Запрос к:", path);

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP ошибка! Статус: ${response.status}`);
    }

    const data = await response.json();
    articles.value = Array.isArray(data)
      ? data
      : data.data || data.articles || data.items || [data];

    articlesStatus.value = {
      success: true,
      message: `Успешно загружено ${articles.value.length} статей`,
    };
  } catch (error) {
    console.error("Ошибка при загрузке статей:", error);
    articlesStatus.value = {
      success: false,
      message: `Ошибка при загрузке статей: ${error.message}`,
    };
  }
};

// Проверка различных путей API
const checkPaths = async () => {
  const paths = [
    "/api",
    "/api/articles",
    "/articles",
    "/api/posts",
    "/posts",
    "/api/blog",
    "/blog",
  ];

  pathsStatus.value = "Проверка доступных путей...";
  pathResults.value = [];

  for (const path of paths) {
    try {
      const response = await fetch(path);
      pathResults.value.push({
        path,
        status: response.status,
        exists: response.ok,
      });
    } catch (error) {
      pathResults.value.push({
        path,
        status: "Ошибка: " + error.message,
        exists: false,
      });
    }
  }

  pathsStatus.value = "Проверка путей завершена";
};

// Авторизация
const login = async () => {
  try {
    loginStatus.value = { success: false, message: "Выполняется вход..." };

    if (!loginForm.value.email || !loginForm.value.password) {
      loginStatus.value = {
        success: false,
        message: "Введите email и пароль",
      };
      return;
    }

    const result = await $api.auth.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    });

    loginStatus.value = {
      success: true,
      message: "Вход выполнен успешно!",
    };
  } catch (error) {
    console.error("Ошибка при входе:", error);
    loginStatus.value = {
      success: false,
      message: `Ошибка при входе: ${error.message}`,
    };
  }
};

// Получение профиля пользователя
const fetchUserProfile = async () => {
  try {
    profileStatus.value = { success: false, message: "Загрузка профиля..." };

    // Прямой запрос к API для отладки
    const response = await fetch("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ошибка! Статус: ${response.status}`);
    }

    userProfile.value = await response.json();
    profileStatus.value = {
      success: true,
      message: "Профиль успешно загружен",
    };
  } catch (error) {
    console.error("Ошибка при загрузке профиля:", error);
    profileStatus.value = {
      success: false,
      message: `Ошибка при загрузке профиля: ${error.message}`,
    };
  }
};
</script>

<style scoped>
.api-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h3 {
  margin-bottom: 15px;
  font-size: 18px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.test-button {
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.test-button:hover {
  background-color: #1976d2;
}

.status {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
}

.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.error {
  background-color: #ffebee;
  color: #c62828;
}

.info {
  background-color: #e3f2fd;
  color: #1565c0;
}

.results {
  margin-top: 15px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow-x: auto;
}

.path-result {
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
}

h4 {
  margin-bottom: 10px;
  font-size: 16px;
}

pre {
  font-family: monospace;
  white-space: pre-wrap;
  font-size: 14px;
}
</style>
