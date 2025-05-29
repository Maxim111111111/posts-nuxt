import { useArticlesApi } from "~/services/api";

export default defineNuxtPlugin((nuxtApp) => {
  const api = useArticlesApi();

  return {
    provide: {
      api,
    },
  };
});
