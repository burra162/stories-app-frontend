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
    } catch (error) {
        console.log(error);
    }
}

function closeEdit() {
    editDialog.value = false;
}


</script>

<template>
    <v-container>

        <v-row class="mx-5 my-5">
            <v-card v-if="story !==null">
                <v-card-title @click="openPreview(story)" class="headline">{{ story.title }}
                    <v-chip class="ma-2" color="primary" label>
                        {{ story.genre }}
                    </v-chip>
                </v-card-title>
                <v-card-text>
                    {{ story.description }}
                </v-card-text>
            </v-card>
        </v-row>

    </v-container>
</template>
