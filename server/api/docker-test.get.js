export default defineEventHandler(async (event) => {
  try {
    // Пробуем подключиться к API в Docker-контейнере
    const endpoints = [
      { url: 'http://localhost:8080/posts', name: 'posts' },
      { url: 'http://localhost:8080/articles', name: 'articles' },
      { url: 'http://localhost:8080/blog', name: 'blog' },
      // Попробуем также хост Docker-контейнера
      { url: 'http://host.docker.internal:8080/posts', name: 'docker-posts' }
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Тестирование подключения к ${endpoint.url}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(endpoint.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        results[endpoint.name] = {
          url: endpoint.url,
          status: response.status,
          ok: response.ok
        };
        
        if (response.ok) {
          try {
            results[endpoint.name].data = await response.json();
          } catch (jsonError) {
            results[endpoint.name].error = 'Не удалось прочитать JSON';
          }
        }
      } catch (error) {
        results[endpoint.name] = {
          url: endpoint.url,
          error: error.message
        };
      }
    }
    
    return {
      message: 'Тест подключения к Docker API',
      timestamp: new Date().toISOString(),
      results
    };
  } catch (error) {
    console.error('Ошибка при тестировании Docker API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при тестировании Docker API',
      data: { error: error.message }
    });
  }
}); 