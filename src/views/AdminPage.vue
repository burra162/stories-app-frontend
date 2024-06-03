<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import StoryService from "../services/StoryService.js";

import GenreService from "../services/GenreService";

const user = ref({});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const genres = ref([]);


function getGenres() {
  GenreService.getGenres()
    .then((response) => {
      genres.value = response.data.map((genre) => genre.name);
    })
    .catch((error) => {
      snackbar.value.color = "error";
      snackbar.value.text = "Error fetching genres";
      snackbar.value.value = true;
    });
}

function closeSnackBar() {
  snackbar.value.value = false;
}

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem("user"));
  getGenres();
  getStories();

});

const addDialog = ref(false);

function openAdd() {
  addDialog.value = true;
}

function closeAdd() {
  addDialog.value = false;
}

const story = ref({
  title: "",
  description: "",
  genre: "",
  userId: 0,
  published: false,
});


function addStory() {
  if (story.value.title === "" || story.value.genre === "") {
    snackbar.value.color = "error";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }
  story.value.userId = user.value.id;
  StoryService.addStory(story.value)

    .then((response) => {
      snackbar.value.color = "green";
      snackbar.value.text = "Story added successfully";
      snackbar.value.value = true;
      closeAdd();
      story.value = {
        title: "",
        description: "",
        genre: "",
        userId: 0,
        published: false,
      };
      getStories();

    })
    .catch((error) => {
      snackbar.value.color = "error";
      snackbar.value.text = "Error adding story";
      snackbar.value.value = true;
    });
}


const editDialog = ref(false);

const storyEdit = ref({
  title: "",
  description: "",
  genre: "",
  userId: user.value.id,
  published: false,
});


function openEdit(story) {
  editDialog.value = true;
  storyEdit.value = story;
}

function closeEdit() {
  editDialog.value = false;
}

function editStory() {
  if (storyEdit.value.title === "" || storyEdit.value.genre === "") {
    snackbar.value.color = "error";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }
  storyEdit.value.userId = user.value.id;
  StoryService.updateStory(storyEdit.value)

    .then((response) => {
      snackbar.value.color = "green";
      snackbar.value.text = "Story updated successfully";
      snackbar.value.value = true;
      closeEdit();
      getStories();
      storyEdit.value = {
        title: "",
        description: "",
        genre: "",
        userId: user.value.id,
        published: false,
      };
    })
    .catch((error) => {
      snackbar.value.color = "error";
      snackbar.value.text = "Error updating story";
      snackbar.value.value = true;
    });
}

const stories = ref([]);

function getStories() {
  StoryService.getStories()
    .then((response) => {
      stories.value = response.data;
    })
    .catch((error) => {
      snackbar.value.color = "error";
      snackbar.value.text = "Error fetching stories";
      snackbar.value.value = true;
    });
}


const previewStory = ref({});
const previewDialog = ref(false);

function openPreview(story) {
  previewDialog.value = true;
  previewStory.value = story;
}

function closePreview() {
  previewDialog.value = false;
}



</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Stories
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()">Add</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="story in stories" :key="story.id" cols="12" md="6" lg="4">
          <v-card class="mb-4" @click="openPreview(story)">
            <v-card-title class="headline">{{ story.title }}
              <v-chip class="ma-2" color="primary" label>
                {{ story.genre }}
              </v-chip>
            </v-card-title>
            <v-card-text v-if="story.description.length > 0" class="single-line-text">
              {{ story.description }}
            </v-card-text>
            <v-card-text v-else class="single-line-text">
              Start using the AI to generate a story.
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="openEdit(story)">Edit</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="green" @click="openModify(story)">Modify story</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>


      <v-dialog persistent v-model="addDialog" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">Add Story</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="story.title" label="Title"></v-text-field>
                </v-col>

                <v-select v-model="story.genre" label="Select" :items="genres">
                </v-select>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" text @click="closeAdd()">Close</v-btn>
            <v-btn variant="flat" color="primary" text @click="addStory()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog persistent v-model="editDialog" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Story</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="storyEdit.title" label="Title"></v-text-field>
                </v-col>

                <v-select v-model="storyEdit.genre" label="Select" :items="genres">
                </v-select>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" text @click="closeEdit()">Close</v-btn>
            <v-btn variant="flat" color="primary" text @click="editStory()">Save</v-btn>
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


<style scoped>
.single-line-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>