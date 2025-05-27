export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const target = 'http://localhost:8080';
  
  // Получаем путь запроса
  const path = event.path.replace('/api/', '');
  const url = `${target}/${path}`;
  
  console.log(`Проксирование запроса к: ${url}`);
  
  // Получаем метод и тело запроса
  const method = event.method;
  let body = null;
  
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await readBody(event);
  }
  
  // Получаем заголовки запроса
  const headers = event.headers || {};
  
  try {
    // Выполняем запрос к API
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    
    // Если ответ не успешный, выбрасываем ошибку
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Ошибка API' }));
      throw createError({
        statusCode: response.status,
        statusMessage: errorData.message || `Ошибка API: ${response.status}`,
        data: errorData
      });
    }
    
    // Если ответ пустой (204), возвращаем null
    if (response.status === 204) {
      return null;
    }
    
    // Возвращаем данные
    return await response.json();
  } catch (error) {
    console.error('Ошибка при проксировании запроса:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Внутренняя ошибка сервера',
      data: error.data
    });
  }
}); 