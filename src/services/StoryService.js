import apiClient from "./services";


export default {
    getStories() {
        return apiClient.get("stories");
    },

    getStory(id) {
        return apiClient.get("stories/" + id);
    },

    addStory(story) {
        return apiClient.post("stories", story);
    },

    updateStory(story) {
        return apiClient.put("stories/" + story.id, story);
    },

    deleteStory(id) {
        return apiClient.delete("stories/" + id);
    }
}
