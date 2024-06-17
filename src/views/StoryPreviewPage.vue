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

const review = ref({
    review: "",
});

const story = ref(null);
const reviews = ref([]);

onMounted(() => {
    user.value = JSON.parse(localStorage.getItem("user"));
    getStory();
    getReviews();
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


async function getReviews() {
    try {
        const response = await StoryService.getReviews(route.params.id);
        reviews.value = response.data;
    } catch (error) {
        console.log(error);
    }
}

async function addReview() {
    try {
        review.value.storyId = story.value.id;
        review.value.userId = user.value.id;
        await StoryService.addReview(review.value);
        snackbar.value = {
            value: true,
            color: "green",
            text: "Review added",
        };
        getReviews();
    } catch (error) {
        snackbar.value.color = "red";
        snackbar.value.text = "Error adding review";
        snackbar.value.value = true;
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
                <v-card-actions class="headline mx-5">
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



                    <v-divider v-if="reviews.length > 0" class="mx-2 my-5"></v-divider>
                    <v-list v-if="reviews.length > 0">
                        <v-list-item  class="review my-3" v-for="review in reviews" :key="review.id">
                            <v-list-item-title >
                                {{ review.review }}
                            </v-list-item-title>
                            <v-list-item-subtitle class="my-5"> By 
                                {{ review.user.firstname }} {{ review.user.lastname }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>

                    <v-divider class="mx-2 my-5"></v-divider>

                    <v-textarea v-model="review.review" label="Add review" outlined></v-textarea>
                    <v-btn @click="addReview(review.review)" color="primary">Add review</v-btn>
                </v-card-text>
            </v-card>
        </v-row>

        <v-snackbar v-model="snackbar.value" rounded="pill">
            {{ snackbar.text }}

            <template v-slot:actions>
                <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>


<style scoped>

.review {
    background-color: #cbf0f1;
    border-radius: 10px;
    
}
</style>