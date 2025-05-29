export default defineEventHandler(async (event) => {
  try {
    // Тестируем подключение к API
    const apiEndpoints = [
      'http://localhost:8080/posts',
      'http://localhost:8080/articles',
      'http://localhost:8080/blog'
    ];
    
    const results = {};
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(endpoint);
        results[endpoint] = {
          status: response.status,
          ok: response.ok,
          data: response.ok ? await response.json() : null
        };
      } catch (error) {
        results[endpoint] = {
          status: 'error',
          message: error.message
        };
      }
    }
    
    return {
      message: 'Тест API',
      results,
      proxyConfig: {
        target: 'http://localhost:8080',
        path: event.path
      }
    };
  } catch (error) {
    console.error('Ошибка в тестовом эндпоинте:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Внутренняя ошибка сервера',
      data: { error: error.message }
    });
  }
}); 