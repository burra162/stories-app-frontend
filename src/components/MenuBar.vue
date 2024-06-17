<script setup>
import ocLogo from "/oc_logo.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const user = ref(null);
const title = ref("Stories App");
const logoURL = ref("");
const isAdmin = ref(false);

onMounted(() => {
  logoURL.value = ocLogo;
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value !== null) {
    if (user.value.type === "admin") {
      isAdmin.value = true;
    } else {
      isAdmin.value = false;
    }
  }
});

function openProfile() {
  router.push({ name: "profile" });
}


function navigateHome() {
  if (user.value === null) {
    router.push({ name: "login" });
  } else {
    router.push({ name: "home" });
  }
}

</script>

<template>
  <div>
    <v-app-bar color="primary" app dark>

      <v-toolbar-title @click="navigateHome"class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn v-if="isAdmin" class="mx-2" :to="{ name: 'genres' }"> Genres </v-btn>
      <v-btn v-if="isAdmin" class="mx-2" :to="{ name: 'users' }"> Users </v-btn>

      <v-menu v-if="user !== null" min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn @click="openProfile" icon v-bind="props">
            <v-avatar class="mx-auto text-center" color="accent" size="large">
              <span class="white--text font-weight-bold">{{
          `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                }}</span>
            </v-avatar>
          </v-btn>
        </template>

      </v-menu>
    </v-app-bar>
  </div>
</template>
