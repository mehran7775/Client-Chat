import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({

   ssr: false,
   
   typescript: {
      strict: true
   },

   tailwindcss: {
      content: [
         `components/**/*.{vue,js,ts}`,
         `layouts/**/*.vue`,
         `pages/**/*.vue`,
         `app.vue`,
         `plugins/**/*.{js,ts}`,
         `nuxt.config.{js,ts}`,
      ],
      theme: {
         extend: {
            colors: { themeBackground: 'var(--background)', themeText: 'var(--text)', },
         },
      },
      plugins: [],
      cssPath: '~/assets/styles/css/tailwind.css',
      // configPath: '@/tailwind.config.js',
      exposeConfig: false,
      injectPosition: 0,
      viewer: false,
   },

   buildModules: [
      '@pinia/nuxt',
      '@nuxtjs/tailwindcss'
   ],

   css: [
      '~/assets/styles/scss/main.scss',
      '~/assets/styles/css/main.css',
      'animate.css/animate.min.css'
   ],

   vite: {
      css: {
         preprocessorOptions: {
            scss: {
               additionalData: '@import "@/assets/styles/scss/global.scss";',
            },
         },
      },
   },

})
