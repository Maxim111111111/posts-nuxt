export default defineEventHandler(async (event) => {
  // Получаем путь запроса после /api/direct-docker/
  const path = event.path.replace("/api/direct-docker/", "");
  const url = `http://localhost:8080/${path}`;

  console.log(`Прямой запрос к Docker API: ${url}`);

  // Получаем метод и тело запроса
  const method = event.method;
  let body = null;

  if (["POST", "PUT", "PATCH"].includes(method)) {
    body = await readBody(event);
  }

  // Получаем заголовки запроса
  const headers = event.headers || {};

  try {
    // Выполняем запрос к API
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`Ответ от Docker API: ${response.status}`);

    // Если ответ не успешный, выбрасываем ошибку
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка Docker API" }));
      throw createError({
        statusCode: response.status,
        statusMessage:
          errorData.message || `Ошибка Docker API: ${response.status}`,
        data: errorData,
      });
    }

    // Если ответ пустой (204), возвращаем null
    if (response.status === 204) {
      return null;
    }

    // Возвращаем данные
    return await response.json();
  } catch (error) {
    console.error("Ошибка при запросе к Docker API:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Внутренняя ошибка сервера",
      data: error.data || { error: error.message },
    });
  }
});
