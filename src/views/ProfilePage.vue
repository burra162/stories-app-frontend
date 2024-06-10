<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import UserServices from "../services/UserServices";
import { useRouter } from "vue-router";

const router = useRouter();



const user = ref(null);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});


function closeSnackBar() {
  snackbar.value.value = false;
}

function update() {
  UserServices.updateUser(user.value)
    .then((data) => {
      console.log(data);
      snackbar.value.color = "green";
      snackbar.value.text = "Profile updated successfully";
      snackbar.value.value = true;

      localStorage.setItem("user", JSON.stringify(user.value));
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error updating profile";
      snackbar.value.value = true;
    });
}


function logout() {
  UserServices.logoutUser()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.removeItem("user");
  user.value = null;
  router.push({ name: "login" });
}

</script>

<template>
  <v-container>
    <div id="body">
      <v-row v-if="user !== null">
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h5 font-weight-bold">
            <v-card-actions>
              Profile
              <v-spacer></v-spacer>
              <v-btn variant="flat" color="primary" @click="logout">Logout</v-btn>
            </v-card-actions>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="user.firstName" label="First Name" outlined ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="user.lastName" label="Last Name" outlined ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="user.email" label="Email" outlined ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="flat" color="primary" @click="update">Update profile</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

      </v-row>



      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
