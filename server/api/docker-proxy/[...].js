export default defineEventHandler(async (event) => {
  // Получаем путь запроса после /api/docker-proxy/
  const path = event.path.replace('/api/docker-proxy/', '');
  
  // Пробуем различные варианты подключения к Docker-контейнеру
  const targets = [
    `http://localhost:8080/${path}`,
    `http://host.docker.internal:8080/${path}`,
    `http://docker.for.mac.localhost:8080/${path}`
  ];
  
  console.log(`Попытка проксирования запроса к Docker: ${path}`);
  console.log(`Цели: ${targets.join(', ')}`);
  
  // Получаем метод и тело запроса
  const method = event.method;
  let body = null;
  
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await readBody(event);
  }
  
  // Получаем заголовки запроса
  const headers = event.headers || {};
  
  // Пробуем все варианты подключения
  let lastError = null;
  
  for (const url of targets) {
    try {
      console.log(`Попытка подключения к: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Ответ от ${url}: ${response.status}`);
      
      // Если ответ успешный, возвращаем данные
      if (response.ok) {
        // Если ответ пустой (204), возвращаем null
        if (response.status === 204) {
          return null;
        }
        
        return await response.json();
      }
      
      // Сохраняем ошибку, но продолжаем пробовать другие URL
      lastError = {
        url,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      console.error(`Ошибка при подключении к ${url}:`, error);
      lastError = {
        url,
        error: error.message
      };
    }
  }
  
  // Если все попытки неудачны, возвращаем ошибку
  throw createError({
    statusCode: 500,
    statusMessage: 'Не удалось подключиться к Docker API',
    data: { 
      error: 'Все попытки подключения к Docker API завершились ошибкой',
      details: lastError
    }
  });
}); 