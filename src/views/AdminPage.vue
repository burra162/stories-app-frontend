<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

import StoryService from "../services/StoryService.js";
import GenreComponent from "../components/GenreComponent.vue";

import GenreService from "../services/GenreService";

const user = ref({});
const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const genres = ref([]);

const actualGenres = ref([]);


function getGenres() {
  GenreService.getGenres()
    .then((response) => {
      actualGenres.value = response.data;
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

const isAdmin = ref(false);


onMounted(() => {
  user.value = JSON.parse(localStorage.getItem("user"));
  isAdmin.value = user.value !== null && user.value.type === "admin";
  getGenres();
  getStories();
  getFavoriteStories();

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
  previewDialog.value = false;
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

const chats = ref([]);

const modifyDialog = ref(false);
const modifyStory = ref({});

function openModify(story) {
  modifyDialog.value = true;
  modifyStory.value = story;
  getChats();
}

function closeModify() {
  modifyDialog.value = false;
}

function getChats() {
  StoryService.getChats(modifyStory.value.id)
    .then((response) => {
      chats.value = response.data;
      // scroll dialog to bottom of the list
      setTimeout(() => {
        const dialog = document.querySelector("#modifyDialog");
        dialog.scrollTop = dialog.scrollHeight;
      }, 100);
    })
    .catch((error) => {
      snackbar.value.color = "error";
      snackbar.value.text = "Error fetching chats";
      snackbar.value.value = true;
    });
}

const chat = ref({
  message: "",
  storyId: modifyStory.value.id,
});

function sendMessage() {
  if (chat.value.message === "") {
    snackbar.value.color = "error";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }
  StoryService.addChat(modifyStory.value.id, chat.value)
    .then((response) => {
      snackbar.value.color = "green";
      snackbar.value.text = "Message sent successfully";
      snackbar.value.value = true;
      chat.value.message = "";
      getChats();
    })
    .catch((error) => {
      snackbar.value.color = "error";
      snackbar.value.text = "Error sending message";
      snackbar.value.value = true;
    });
}



function publish(message) {
  modifyStory.value.published = true;
  modifyStory.value.description = message;
  StoryService.updateStory(modifyStory.value)
    .then((response) => {
      snackbar.value.color = "green";
      snackbar.value.text = "Story published successfully";
      snackbar.value.value = true;
      closeModify();
      getStories();
    })
    .catch((error) => {
      snackbar.value.color = "error";
      snackbar.value.text = "Error publishing story";
      snackbar.value.value = true;
    });

}
function openStory(stor) {
  router.push("/story/" + stor.id);
}


function openStoryList(genre) {
  router.push({ name: "stories", params: { genre: genre.name } });
}

const favoriteStories = ref([]);

function getFavoriteStories() {
  StoryService.getFavoriteStories(user.value.id)
    .then((response) => {
      favoriteStories.value = response.data;
    })
    .catch((error) => {
      snackbar.value.color = "error";
      snackbar.value.text = "Error fetching favorite stories";
      snackbar.value.value = true;
    });
}

</script>

<template>
  <v-container>
    <div id="body">

      <v-row class="mb-4">
        <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Genres
          </v-card-title>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="genre in actualGenres" :key="genre" cols="12" md="6" lg="3">
          <genre-component :genre="genre" @click="openStoryList(genre)"></genre-component>
        </v-col>
      </v-row>



      <v-row align="center" class="mb-4">
        <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Stories
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()">Add</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="story in stories" :key="story.id" cols="12" md="6" lg="3">
          <v-card class="mb-4">
            <v-card-title @click="openStory(story)" class="headline">{{ story.title }}
              <v-chip class="ma-2" color="primary" label>
                {{ story.genre }}
              </v-chip>
            </v-card-title>
            <v-card-text @click="openStory(story)" v-if="story.description.length > 0" class="single-line-text">
              {{ story.description }}
            </v-card-text>
            <v-card-text @click="openStory(story)" v-else class="single-line-text">
              Start writing a story.
            </v-card-text>
            <v-card-actions v-if="isAdmin">
              <v-btn color="primary" @click="openEdit(story)">Edit</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="green" @click="openModify(story)">Modify story</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>


      <v-row align="center" class="mb-4">
        <v-col cols="10">
          <v-card-title class="pl-0 text-h4 font-weight-bold">Favorite Stories
          </v-card-title>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="story in favoriteStories" :key="story.id" cols="12" md="6" lg="3">
          <v-card class="mb-4">
            <v-card-title @click="openStory(story)" class="headline">{{ story.title }}
              <v-chip class="ma-2" color="primary" label>
                {{ story.genre }}
              </v-chip>
            </v-card-title>
            <v-card-text @click="openStory(story)" v-if="story.description.length > 0" class="single-line-text">
              {{ story.description }}
            </v-card-text>
            <v-card-text @click="openStory(story)" v-else class="single-line-text">
              Start writing a story.
            </v-card-text>
            <v-card-actions v-if="isAdmin">
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


      <v-dialog id="modifyDialog" v-model="modifyDialog" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">Modify Story</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row v-for="chat in chats">
                <v-col cols="12">
                  <v-card :color="chat.role === 'User' ? 'secondary' : 'teal'">
                    <v-card-title>{{ chat.role }}</v-card-title>
                    <v-card-text>{{ chat.message }}</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="publish(chat.message)">Publish this story</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
              <v-col cols="12">
                <v-text-field v-model="chat.message" label="Message"></v-text-field>
              </v-col>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" text @click="closeModify()">Close</v-btn>
            <v-btn variant="flat" color="primary" text @click="sendMessage()">Send</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-dialog v-model="previewDialog" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ previewStory.title }}</span>
            <v-chip class="ma-2" color="primary" label>
              {{ previewStory.genre }}
            </v-chip>
          </v-card-title>
          <v-card-text v-if="previewStory.description.length > 0">
            {{ previewStory.description }}
          </v-card-text>
          <v-card-text v-else class="single-line-text">
            Start using the AI to generate a story.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green" @click="openModify(previewStory)">Modify story</v-btn>
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