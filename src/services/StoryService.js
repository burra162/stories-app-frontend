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
    },

    // get chats for a story
    getChats(storyId) {
        return apiClient.get("stories/" + storyId + "/chat");
    },

    // add chat to a story
    addChat(storyId, chat) {
        return apiClient.post("stories/" + storyId + "/chat", chat);
    },
    
    // get stories by genre
    getStoriesByGenre(genre) {
        return apiClient.get("stories/genre/" + genre);
    },

    // get stories by author
    getStoriesByAuthor(author) {
        return apiClient.get("stories/author/" + author);
    },

    // get user suggested storires

    getSuggestedStories(userId) {
        return apiClient.get("stories/suggested/" + userId);
    }

}
