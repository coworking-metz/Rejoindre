import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/infos",
      meta: { title: 'Vos informations de contact' },
      component: () => import("@/views/Rejoindre.vue"),
    },
    {
      path: "/",
      meta: { title: 'Nous rejoindre' },
      component: () => import("@/views/Choix.vue"),
    },
    {
      path: "/rendez-vous",
      meta: { title: 'Votre rendez-vous' },
      component: () => import("@/views/Visite.vue"),
    },
    {
      path: "/visite",
      meta: { title: 'Votre rendez-vous' },
      component: () => import("@/views/Visite.vue"),
    },
    {
      path: "/mot-de-passe",
      meta: { title: 'Votre mot de passe' },
      component: () => import("@/views/MotDePasse.vue"),
    },
    {
      path: "/recap",
      meta: { title: 'Récapitulatif de votre rendez-vous' },
      component: () => import("@/views/Recap.vue"),
    },
  ],
});
// After creating the Vue Router instance
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - Rejoindre le Coworking Metz';
  }
  next();
});
export default router;
