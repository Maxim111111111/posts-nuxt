import { useRuntimeConfig } from "nuxt/app";
import { ref } from "vue";

export const usePostsApi = () => {
  const config = useRuntimeConfig();
  const token = ref("");

  // Установка токена авторизации
  const setToken = (newToken) => {
    token.value = newToken;
  };

  // Получение токена из localStorage при инициализации
  const initToken = () => {
    if (process.client) {
      const savedToken = localStorage.getItem("auth_token");
      if (savedToken) {
        token.value = savedToken;
      }
    }
  };

  // Общая функция для запросов к API
  const apiRequest = async (endpoint, options = {}) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      // Добавляем токен авторизации, если он есть
      if (token.value) {
        headers["Authorization"] = `Bearer ${token.value}`;
      }

      // Проверим и выведем в консоль URL для отладки
      const url = `/api${endpoint}`;
      console.log("API Request to:", url);

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Проверяем статус ответа
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Ошибка API: ${response.status}`);
      }

      // Если ответ пустой, возвращаем true
      if (response.status === 204) {
        return true;
      }

      // Пробуем распарсить JSON
      return await response.json();
    } catch (error) {
      console.error("API ошибка:", error);
      throw error;
    }
  };

  // Аутентификация
  const auth = {
    // Регистрация пользователя
    register: (userData) => {
      return apiRequest("/users/reg", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },

    // Вход в систему
    login: async (credentials) => {
      const result = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (result && result.token) {
        token.value = result.token;
        if (process.client) {
          localStorage.setItem("auth_token", result.token);
        }
      }

      return result;
    },

    // Выход из системы
    logout: () => {
      token.value = "";
      if (process.client) {
        localStorage.removeItem("auth_token");
      }
    },

    // Получение профиля текущего пользователя
    getProfile: () => {
      return apiRequest("/users/profile");
    },
  };

  // Работа с постами
  const posts = {
    // Получение всех опубликованных постов
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams(params).toString();
      return apiRequest(`/posts${queryParams ? `?${queryParams}` : ""}`);
    },

    // Получение поста по ID
    getById: (id) => {
      return apiRequest(`/posts/${id}`);
    },

    // Создание поста
    create: (postData) => {
      return apiRequest("/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      });
    },

    // Обновление поста
    update: (id, postData) => {
      return apiRequest(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(postData),
      });
    },

    // Удаление поста
    delete: (id) => {
      return apiRequest(`/posts/${id}`, {
        method: "DELETE",
      });
    },
  };

  return {
    initToken,
    setToken,
    auth,
    posts,
  };
};

export default usePostsApi;
