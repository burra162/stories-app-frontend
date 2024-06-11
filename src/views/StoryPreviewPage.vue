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


const story = ref(null);

onMounted(() => {
    user.value = JSON.parse(localStorage.getItem("user"));
    getStory();
});


async function getStory() {
    try {
        const response = await StoryService.getStory(route.params.id);
        story.value = response.data;
        isFavoriteStory();
    } catch (error) {
        console.log(error);
    }
}

function closeEdit() {
    editDialog.value = false;
}


const isFavorite = ref(false);

async function addFavorite() {
    try {
        await StoryService.addFavorite(user.value.id, story.value.id);
        snackbar.value = {
            value: true,
            color: "success",
            text: "Story added to favorites",
        };
        isFavorite.value = true;
    } catch (error) {
        console.log(error);
    }
}

async function removeFavorite() {
    try {
        await StoryService.removeFavorite(user.value.id, story.value.id);
        snackbar.value = {
            value: true,
            color: "success",
            text: "Story removed from favorites",
        };
        isFavorite.value = false;
    } catch (error) {
        console.log(error);
    }
}

async function isFavoriteStory() {
    try {
        const response = await StoryService.isFavorite(user.value.id, story.value.id);
        console.log(response.data);
        isFavorite.value = response.data.isFavorite;
    } catch (error) {
        console.log(error);
    }
}

</script>

<template>
    <v-container>

        <v-row class="mx-5 my-5">
            <v-card v-if="story !== null">
                <v-card-actions  class="headline mx-5">
                    <h3>{{ story.title }}</h3>
                    <v-chip class="ma-2" color="primary" label>
                        {{ story.genre }}
                    </v-chip>
                    <v-spacer></v-spacer>
                    <v-icon v-if="!isFavorite" color="red" icon @click="addFavorite">mdi-heart-outline</v-icon>
                    <v-icon v-else color="red" icon @click="removeFavorite">mdi-heart</v-icon>
                </v-card-actions>
                <v-card-text>
                    {{ story.description }}
                </v-card-text>
            </v-card>
        </v-row>

    </v-container>
</template>
