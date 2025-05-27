// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: "Блог",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Блог на Nuxt 3" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "stylesheet", href: "/css/main.css" },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  css: ["@/assets/css/main.css", "@/assets/css/transitions.css"],
  modules: [],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/main.css" as *;',
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080",
    },
  },
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        prependPath: false,
      },
    },
    routeRules: {
      "/api/**": {
        proxy: "http://localhost:8080/**",
        cors: true,
        headers: {
          "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        },
      },
    },
  },
  experimental: {
    payloadExtraction: false,
  },
  router: {
    options: {
      linkActiveClass: "nav__link--active",
      linkExactActiveClass: "nav__link--exact-active",
    },
  },
});
