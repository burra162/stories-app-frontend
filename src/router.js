import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("./views/AdminPage.vue"),
    },
    {
      path: "/genres",
      name: "genres",
      component: () => import("./views/GenrePage.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("./views/ProfilePage.vue"),
    }, {
      path: "/password-reset",
      name: "password-reset",
      component: () => import("./views/PasswordResetPage.vue"),
    },
    {
      path: "/stories/:genre",
      name: "stories",
      component: () => import("./views/StoriesPage.vue"),
    },
    {
      path: "/story/:id",
      name: "story",
      component: () => import("./views/StoryPreviewPage.vue"),
    },
    {
      path:"/users",
      name: "users",
      component: () => import("./views/UsersPage.vue"),
    }
  ],
});

export default router;
