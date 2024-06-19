<script setup>
import { onMounted } from "vue";
import { ref } from "vue";

import UserServices from "../services/UserServices.js";


const user = ref(null);

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});


const users = ref([]);

function closeSnackBar() {
    snackbar.value.value = false;
}

function getUsers() {
    UserServices.getUser()
        .then((response) => {
            users.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}


onMounted(() => {
    user.value = JSON.parse(localStorage.getItem("user"));
    getUsers();
});


function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }
    UserServices.deleteUser(id)
        .then(() => {
            getUsers();
            snackbar.value = {
                value: true,
                color: "success",
                text: "User deleted successfully",
            };
        })
        .catch((error) => {
            console.log(error);
            snackbar.value = {
                value: true,
                color: "error",
                text: "Error deleting user",
            };
        });
}

</script>

<template>
    <v-container>
        <div id="body">

                <table >
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td>{{ user.firstName }}</td>
                            <td>{{ user.lastName }}</td>
                            <td>{{ user.email }}</td>
                            <td>
                                <v-btn @click="deleteUser(user.id)" color="primary" dark>Delete</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </table>



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


<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 1.2em;
    text-align: left;
}

thead tr {
    background-color: #80162B;
    color: #ffffff;
    text-align: left;
    font-weight: bold;
}

th, td {
    padding: 12px 15px;
    border: 1px solid #dddddd;
}

tbody tr {
    border-bottom: 1px solid #dddddd;
}

tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

tbody tr:last-of-type {
    border-bottom: 2px solid #80162B;
}
</style>