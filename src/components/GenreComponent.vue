<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);
const isAdmin = ref(false);


const props = defineProps({
    genre: {
        required: true,
    },
    showEdit: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['edit-genre']);


onMounted(() => {

    // print props 
    console.log(props.genre);
    console.log(props.showEdit);
    user.value = JSON.parse(localStorage.getItem("user"));
    if (user.value !== null) {
        if (user.value.type === "admin") {
            isAdmin.value = true;
        } else {
            isAdmin.value = false;
        }
    }
});

function handleEditClick(event) {
    event.stopPropagation();
    emit('edit-genre', props.genre);
}

</script>

<template>

    <v-card class="mx-auto" max-width="600" outlined>
        <v-img :src="genre.image" height="200px" cover></v-img>
        <v-card-title>
            {{ genre.name }}
        </v-card-title>
        <v-card-actions v-if="showEdit">
            <v-btn color="primary" text @click="handleEditClick" >
                Edit
            </v-btn>
        </v-card-actions>
    </v-card>

</template>
