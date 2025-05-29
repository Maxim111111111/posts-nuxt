export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  
  try {
    // Пробуем загрузить статью напрямую
    const response = await fetch(`http://localhost:3001/articles/${id}`);
    
    if (!response.ok) {
      throw new Error(`Ошибка при загрузке статьи: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке статьи:', error);
    
    // Пробуем загрузить пост
    try {
      const postsResponse = await fetch(`http://localhost:3001/posts/${id}`);
      
      if (!postsResponse.ok) {
        throw new Error(`Ошибка при загрузке поста: ${postsResponse.status}`);
      }
      
      const postData = await postsResponse.json();
      return postData;
    } catch (postsError) {
      console.error('Ошибка при загрузке поста:', postsError);
      throw createError({
        statusCode: 404,
        statusMessage: 'Статья не найдена',
        data: {
          originalError: error.message,
          postsError: postsError.message
        }
      });
    }
  }
}); 