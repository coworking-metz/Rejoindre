import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/infos",
      component: () => import("@/views/Rejoindre.vue"),
    },
    {
      path: "/",
      component: () => import("@/views/Visite.vue"),
    },
    {
      path: "/visite",
      component: () => import("@/views/Visite.vue"),
    },
    {
      path: "/mot-de-passe",
      component: () => import("@/views/MotDePasse.vue"),
    },
    {
      path: "/recap",
      component: () => import("@/views/Recap.vue"),
    },
  ],
});
