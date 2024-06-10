<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import UserServices from "../services/UserServices";

const user = ref(null);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


const password = ref({
  email : "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
});


onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value !== null) {
    password.value.email = user.value.email;
    password.value.otp = '1234';
  }
});

function closeSnackBar() {
  snackbar.value.value = false;
}

const update =
  async () => {


    if (password.value.otp === "" || password.value.newPassword === "" || password.value.confirmPassword === "" || password.value.email === "" ) {
      snackbar.value.color = "error";
      snackbar.value.text = "All fields are required";
      snackbar.value.value = true;
      return;
    }
    if (password.value.newPassword !== password.value.confirmPassword) {
      snackbar.value.color = "error";
      snackbar.value.text = "Passwords do not match";
      snackbar.value.value = true;
      return;
    }

    const data = {
      email: password.value.email,
      otp: password.value.otp,
      newPassword: password.value.newPassword,
      confirmPassword: password.value.confirmPassword,
    };

    UserServices.resetPassword(data)
      .then((data) => {
        console.log(data);
        snackbar.value.color = "green";
        snackbar.value.text = "Password reset successfully";
        snackbar.value.value = true;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.color = "error";
        snackbar.value.text = "Error resetting password";
        snackbar.value.value = true;
      });
  };

</script>

<template>
  <v-container>
    <div id="body">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h5 font-weight-bold">
              <v-card-actions>
                Reset password
              </v-card-actions>
            </v-card-title>
            <v-card-text>

              <v-text-field v-model="password.email" label="Email" ></v-text-field>
              <v-text-field v-model="password.otp" label="Enter opt sent to mail"></v-text-field>
              <v-text-field v-model="password.newPassword" label="New password" type="password"></v-text-field>
              <v-text-field v-model="password.confirmPassword" label="Confirm password" type="password"></v-text-field>

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
