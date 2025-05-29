export default defineEventHandler(async (event) => {
  // Получаем информацию о запросе
  const url = event.node.req.url;
  const method = event.node.req.method;
  const headers = event.node.req.headers;

  // Проверяем доступность API через прокси
  let apiStatus = null;
  try {
    const response = await fetch("http://localhost:8080/api/articles");
    apiStatus = {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    };

    if (response.ok) {
      try {
        apiStatus.data = await response.json();
      } catch (e) {
        apiStatus.parseError = e.message;
      }
    }
  } catch (error) {
    apiStatus = {
      error: true,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Отладочная информация",
    request: {
      url,
      method,
      headers: {
        host: headers.host,
        "user-agent": headers["user-agent"],
        accept: headers.accept,
      },
    },
    apiStatus,
    timestamp: new Date().toISOString(),
  };
});
