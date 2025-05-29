export default defineEventHandler((event) => {
  // Добавляем заголовки CORS для всех запросов
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  });

  // Обрабатываем preflight запросы
  if (getMethod(event) === 'OPTIONS') {
    return { statusCode: 204 };
  }
}); 