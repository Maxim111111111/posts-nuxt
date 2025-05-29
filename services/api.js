import { useRuntimeConfig } from "nuxt/app";
import { ref } from "vue";

export const useArticlesApi = () => {
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

    // Подтверждение email
    verify: (verificationData) => {
      return apiRequest("/users/verify", {
        method: "POST",
        body: JSON.stringify(verificationData),
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

  // Работа со статьями
  const articles = {
    // Получение всех опубликованных статей
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams(params).toString();
      return apiRequest(`/articles${queryParams ? `?${queryParams}` : ""}`);
    },

    // Получение статьи по ID
    getById: (id) => {
      return apiRequest(`/articles/${id}`);
    },

    // Создание статьи
    create: (articleData) => {
      return apiRequest("/articles", {
        method: "POST",
        body: JSON.stringify(articleData),
      });
    },

    // Обновление статьи
    update: (id, articleData) => {
      return apiRequest(`/articles/${id}`, {
        method: "PUT",
        body: JSON.stringify(articleData),
      });
    },

    // Публикация/снятие с публикации статьи
    togglePublish: (id, isPublished) => {
      return apiRequest(`/articles/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: isPublished }),
      });
    },

    // Удаление статьи
    delete: (id) => {
      return apiRequest(`/articles/${id}`, {
        method: "DELETE",
      });
    },

    // Получение статей текущего пользователя
    getMy: () => {
      return apiRequest("/articles/my");
    },

    // Загрузка превью для статьи
    uploadPreview: (id, file) => {
      const formData = new FormData();
      formData.append("file", file);

      return apiRequest(`/articles/${id}/preview`, {
        method: "POST",
        body: formData,
        headers: {}, // Убираем Content-Type, чтобы браузер установил правильный с boundary
      });
    },

    // Добавление вложения к статье
    addAttachment: (id, file) => {
      const formData = new FormData();
      formData.append("file", file);

      return apiRequest(`/articles/${id}/attachments`, {
        method: "POST",
        body: formData,
        headers: {}, // Убираем Content-Type, чтобы браузер установил правильный с boundary
      });
    },

    // Удаление вложения из статьи
    removeAttachment: (articleId, attachmentId) => {
      return apiRequest(`/articles/${articleId}/attachments/${attachmentId}`, {
        method: "DELETE",
      });
    },
  };

  // Работа с постами (альтернативный путь для статей)
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

  // Работа с уведомлениями
  const notifications = {
    // Получение уведомлений пользователя
    getAll: () => {
      return apiRequest("/notifications");
    },

    // Получение количества непрочитанных уведомлений
    getUnreadCount: () => {
      return apiRequest("/notifications/unread/count");
    },

    // Отметка уведомления как прочитанного
    markAsRead: (id) => {
      return apiRequest(`/notifications/${id}/read`, {
        method: "PATCH",
      });
    },

    // Отметка всех уведомлений как прочитанных
    markAllAsRead: () => {
      return apiRequest("/notifications/read/all", {
        method: "PATCH",
      });
    },
  };

  // WebSocket для уведомлений в реальном времени
  const connectWebSocket = () => {
    if (!process.client) return null;

    const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/sockets`;
    const ws = new WebSocket(wsUrl);

    // Добавляем токен в первом сообщении
    ws.onopen = () => {
      if (token.value) {
        ws.send(JSON.stringify({ type: "auth", token: token.value }));
      }
    };

    return ws;
  };

  // Инициализация токена при создании сервиса
  initToken();

  return {
    setToken,
    auth,
    articles,
    posts,
    notifications,
    connectWebSocket,
  };
};
