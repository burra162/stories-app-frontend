<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import StoryService from "../services/StoryService.js";

const router = useRouter();
const route = useRoute();


const user = ref(null);

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});


function closeSnackBar() {
    snackbar.value.value = false;
}

const genre = ref("");

const stories = ref([]);


onMounted(() => {
    user.value = JSON.parse(localStorage.getItem("user"));
    genre.value = route.params.genre;
    if (genre.value === undefined) {
        // get all stories
        getStories();

    } else {
        // get stories by genre
        getStoriesByGenre();
    }
});

async function getStories() {
    try {
        const response = await StoryService.getStories();
        stories.value = response.data;
    } catch (error) {
        console.log(error);
    }
}

async function getStoriesByGenre() {
    try {
        const response = await StoryService.getStoriesByGenre(genre.value);
        stories.value = response.data;
    } catch (error) {
        console.log(error);
    }
}

function closeEdit() {
    editDialog.value = false;
}

function openStory(stor) {
    console.log(stor);
    router.push("/story/" + stor.id);
}


</script>

<template>
    <v-container>

        <v-row>
            <v-col v-for="story in stories" :key="story.id">
                <v-card @click="openStory(story)" class="mb-4">
                    <v-card-title @click="openStory(story)" class="headline">{{ story.title }}
                        <v-chip class="ma-2" color="primary" label>
                            {{ story.genre }}
                        </v-chip>
                    </v-card-title>
                    <v-card-text>
                        {{ story.description }}
                    </v-card-text>


                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>
