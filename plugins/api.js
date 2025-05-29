import usePostsApi from "~/services/api";

export default defineNuxtPlugin((nuxtApp) => {
  const api = usePostsApi();

  return {
    provide: {
      api,
    },
  };
});
