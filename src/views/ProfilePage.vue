<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import UserServices from "../services/UserServices";
import GenreService from "../services/GenreService";
import { useRouter } from "vue-router";

const router = useRouter();

const user = ref(null);

const userGenres = ref([]);

const allGenres = ref([]);


const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value === null) {
    router.push({ name: "login" });
  } else {
    await getGenres();
    await getAllGenres();
  }
});

async function getAllGenres() {
  GenreService.getGenres()
    .then((response) => {
      allGenres.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}


async function getGenres() {
  UserServices.getUserGenres(user.value.id)
    .then((data) => {
      userGenres.value = data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}


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

const selectedGenres = ref([]);

function updateUserGenres() {
  UserServices.updateGenres(user.value.id, selectedGenres.value)
    .then((data) => {
      console.log(data);
      snackbar.value.color = "green";
      snackbar.value.text = "Genres updated successfully";
      snackbar.value.value = true;
      getGenres();
      udpateGenresDialog.value = false;
      
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.color = "error";
      snackbar.value.text = "Error updating genres";
      snackbar.value.value = true;
    });
}

function resetPassword() {
  router.push({ name: "password-reset" });
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


const udpateGenresDialog = ref(false);
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
                  <v-text-field v-model="user.firstName" label="First Name" outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="user.lastName" label="Last Name" outlined></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="user.email" label="Email" outlined></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="resetPassword">Reset password</v-btn>
              <v-spacer></v-spacer>
              <v-btn variant="flat" class="mr-5" color="primary" @click="update">Update profile</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

      </v-row>

      <v-card class="my-5" v-if="user !== null">
        <v-card-title class="text-h5 font-weight-bold">
          <v-card-actions>
            Genres
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="udpateGenresDialog = true">Update Genres</v-btn>
          </v-card-actions>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-for="genre in userGenres" :key="genre.id" cols="12" md="2">
              <v-chip label color="cyan">{{ genre.name }}</v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>


      <v-dialog v-model="udpateGenresDialog" max-width="600">
        <v-card>
          <v-card-title class="text-h5 font-weight-bold">
            <v-card-actions>
              Update Genres
            </v-card-actions>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-select clearable chips label="Select Genres" :items="allGenres" item-title="name" item-value="id"
                  v-model="selectedGenres" multiple></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="udpateGenresDialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" class="mr-5" color="primary" @click="updateUserGenres">Update Genres</v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>
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
