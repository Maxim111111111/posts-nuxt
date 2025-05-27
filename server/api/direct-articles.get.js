export default defineEventHandler(async (event) => {
  try {
    // Пробуем загрузить статьи напрямую
    const response = await fetch("http://localhost:3001/articles");

    if (!response.ok) {
      throw new Error(`Ошибка при загрузке статей: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке статей:", error);

    // Пробуем загрузить посты
    try {
      const postsResponse = await fetch("http://localhost:3001/posts");

      if (!postsResponse.ok) {
        throw new Error(`Ошибка при загрузке постов: ${postsResponse.status}`);
      }

      const postsData = await postsResponse.json();
      return postsData;
    } catch (postsError) {
      console.error("Ошибка при загрузке постов:", postsError);
      throw createError({
        statusCode: 500,
        statusMessage: "Не удалось загрузить статьи",
        data: {
          originalError: error.message,
          postsError: postsError.message,
        },
      });
    }
  }
});
