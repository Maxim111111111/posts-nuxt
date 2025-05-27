export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();

  // Добавляем обработчик для отладки переходов
  router.beforeEach((to, from, next) => {
    console.log(`Переход с ${from.path} на ${to.path}`);
    next();
  });

  // Добавляем обработчик после завершения перехода
  router.afterEach((to, from) => {
    console.log(`Переход завершен: ${to.path}`);
  });
});
