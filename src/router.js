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
      path: "/admin",
      name: "admin",
      component: () => import("./views/AdminPage.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("./views/UserPage.vue"),
    },
    {
      path:"/genres",
      name:"genres",
      component: () => import("./views/GenrePage.vue"),
    },  
    {
      path:"/profile",
      name:"profile",
      component: () => import("./views/ProfilePage.vue"),
    }
  ],
});

export default router;
