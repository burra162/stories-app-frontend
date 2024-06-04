<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import GenreService from "../services/GenreService.js";


const user = ref(null);

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const editDialog = ref(false);

const genres = ref([]);

function closeSnackBar() {
    snackbar.value.value = false;
}

function getGenres() {
    GenreService.getGenres()
        .then((response) => {
            genres.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}


onMounted(() => {
    user.value = JSON.parse(localStorage.getItem("user"));
    getGenres();
});

const genre = ref({
    name: ""
});

const addDialog = ref(false);

function openAdd() {
    addDialog.value = true;
}

function closeAdd() {
    addDialog.value = false;
}

function addGenre() {
    if (genre.value.name === "") {
        snackbar.value = {
            value: true,
            color: "error",
            text: "Genre name is required",
        };
        return;
    }
    GenreService.addGenre(genre.value)
        .then((response) => {
            genres.value.push(response.data);
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Genre added successfully";

            closeAdd();
            genre.value = {
                name: ""
            };
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error adding genre";
        });
}

function openEdit(selectedGenre) {
    genre.value = selectedGenre;
    console.log(genre);
    editDialog.value = true;
}

function closeEdit() {
    editDialog.value = false;
}


function updateGenre() {
    GenreService.updateGenre(genre.value)
        .then((response) => {
            const index = genres.value.findIndex((g) => g.id === response.data.id);
            genres.value[index] = response.data;
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Genre updated successfully";
            closeEdit();
            genre.value = {
                name: ""
            };
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error updating genre";
        });
}


</script>

<template>
    <v-container>
        <div id="body">
            <v-row align="center" class="mb-4">
                <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Genres
                    </v-card-title>
                </v-col>
                <v-col class="d-flex justify-end" cols="2">
                    <v-btn v-if="user !== null" color="accent" @click="openAdd()">Add</v-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col v-for="genre in genres" :key="genre.id" cols="12" md="6" lg="4">
                    <v-card class="mb-4">
                        <v-card-title>{{ genre.name }}</v-card-title>
                        <v-card-actions>
                            <v-btn color="primary" @click="openEdit(genre)">Edit</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>



            <v-dialog persistent v-model="addDialog" width="800">
                <v-card class="rounded-lg elevation-5">
                    <v-card-title class="headline mb-2">Create Genre </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="genre.name" label="Genre" required></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="flat" color="secondary" @click="closeAdd()">Close</v-btn>
                        <v-btn variant="flat" color="primary" @click="addGenre()">Create Genre</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <v-dialog persistent v-model="editDialog" width="800">
                <v-card class="rounded-lg elevation-5">
                    <v-card-title class="headline mb-2">Edit Genre </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="genre.name" label="Genre" required></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="flat" color="secondary" @click="closeEdit()">Close</v-btn>
                        <v-btn variant="flat" color="primary" @click="updateGenre()">Update Genre</v-btn>
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
