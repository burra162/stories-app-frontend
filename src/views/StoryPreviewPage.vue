<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import StoryService from "../services/StoryService.js";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
const isInReadingList = ref(false);

async function isInReadingListStory() {
    try {
        const response = await StoryService.isInReadingList(user.value.id, story.value.id);
        isInReadingList.value = response.data.isInReadingList;
    } catch (error) {
        console.log(error);
    }
}

async function addReadingList() {
    try {
        await StoryService.addReadingList(user.value.id, story.value.id);
        snackbar.value = {
            value: true,
            color: "success",
            text: "Story added to reading list",
        };
        isInReadingList.value = true;
    } catch (error) {
        console.log(error);
    }
}

async function removeReadingList() {
    try {
        await StoryService.removeReadingList(user.value.id, story.value.id);
        snackbar.value = {
            value: true,
            color: "success",
            text: "Story removed from reading list",
        };
        isInReadingList.value = false;
    } catch (error) {
        console.log(error);
    }
}



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

async function deleteReview(reviewId) {
    if (!confirm("Are you sure you want to delete this review?")) {
        return;
    }
    try {
        await StoryService.deleteReview(reviewId);
        snackbar.value = {
            value: true,
            color: "success",
            text: "Review deleted",
        };
        getReviews();
    } catch (error) {
        snackbar.value.color = "red";
        snackbar.value.text = "Error deleting review";
        snackbar.value.value = true;
    }
}

const editReviewDialog = ref(false);

const reviewToEdit = ref(null);

function editReview(review) {
    reviewToEdit.value = review;
    editReviewDialog.value = true;
}


async function updateReview() {
    try {
        await StoryService.updateReview(reviewToEdit.value);
        snackbar.value = {
            value: true,
            color: "success",
            text: "Review edited",
        };
        getReviews();
        editReviewDialog.value = false;
    } catch (error) {
        snackbar.value.color = "red";
        snackbar.value.text = "Error editing review";
        snackbar.value.value = true;
    }
}



function dateFormatted(updatedAt) {
    const date = new Date(updatedAt);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate;
}

async function generatePDF() {
    const content = document.getElementById('pdf-area');

    try {
        const canvas = await html2canvas(content, { scale: 2 }); 
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF();
        const imgWidth = doc.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save(`${story.value.title}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

</script>

<template>
    <v-container>

        <v-row class="mx-5 my-5">
            <v-col cols="12">
                <v-card v-if="story !== null">
                    <div id="pdf-area" class="ma-3">
                        <v-card-actions class="headline mx-5">
                            <h3>{{ story.title }}</h3>
                            <v-chip class="ma-2" color="primary" label>
                                {{ story.genre }}
                            </v-chip>
                            <v-spacer></v-spacer>
                            <div data-html2canvas-ignore="true">

                                <v-icon color="cyan" @click="generatePDF" class="mx-3">mdi-file-pdf-box</v-icon>

                                <v-icon v-if="!isFavorite" class="mx-3" color="red" icon
                                    @click="addFavorite">mdi-heart-outline</v-icon>
                                <v-icon v-else color="red" class="mx-3" icon @click="removeFavorite">mdi-heart</v-icon>

                                <v-icon v-if="!isInReadingList" class="mx-3" color="blue" icon
                                    @click="addReadingList">mdi-bookmark-outline</v-icon>
                                <v-icon v-else color="blue" class="mx-3" icon
                                    @click="removeReadingList">mdi-bookmark</v-icon>
                            </div>
                        </v-card-actions>
                        <v-card-text class="mx-3">
                            {{ story.description }}
                        </v-card-text>
                    </div> <v-card-text>

                        <v-divider v-if="reviews.length > 0" class="mx-2 my-5"></v-divider>
                        <v-list v-if="reviews.length > 0">
                            <v-list-item class="review my-3" v-for="review in reviews" :key="review.id">
                                <v-card-actions>
                                    <v-list-item-title> {{ review.review }} </v-list-item-title> <v-spacer></v-spacer>
                                    <v-list-item-action end v-if="review.user.id === user.id">
                                        <v-icon class="mx-5" @click="deleteReview(review.id)">mdi-delete</v-icon>
                                        <v-icon @click="editReview(review)">mdi-pencil</v-icon>
                                    </v-list-item-action>

                                </v-card-actions>
                                <v-list-item-subtitle class="my-1"> By
                                    {{ review.user.firstname }} {{ review.user.lastname }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>

                        <v-divider class="mx-2 my-5"></v-divider>

                        <v-textarea v-model="review.review" label="Add review" outlined></v-textarea>
                        <v-btn @click="addReview(review.review)" color="primary">Add review</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="editReviewDialog" max-width="500px">
            <v-card>
                <v-card-title>Edit review</v-card-title>
                <v-card-text>
                    <v-textarea v-model="reviewToEdit.review" outlined></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="editReviewDialog = false">Close</v-btn>
                    <v-btn variant="flat" @click="updateReview" color="primary">Update</v-btn>
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
    </v-container>
</template>


<style scoped>
.review {
    background-color: #cbf0f1;
    border-radius: 10px;
}
</style>