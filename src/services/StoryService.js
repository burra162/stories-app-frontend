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
    },

    // get all favorite stories for a user
    getFavoriteStories(userId) {
        return apiClient.get("stories/favorite/" + userId);
    },

    // check if a story is favorite for a user

    isFavorite(userId, storyId) {
        return apiClient.get("stories/isFavorite/" + storyId + "/" + userId);
    },

    // add story to favorites for a user

    addFavorite(userId, storyId) {
        return apiClient.post("stories/addFavorite/" + storyId + "/" + userId);
    },

    // remove story from favorites for a user

    removeFavorite(userId, storyId) {
        return apiClient.delete("stories/removeFavorite/" + storyId + "/" + userId);
    },

    // get all reviews for a story
    getReviews(storyId) {
        return apiClient.get(`stories/${storyId}/reviews` );
    },

    // add review to a story

    addReview(review) {
        return apiClient.post("reviews/", review);
    },

    // update review for a story

    updateReview(review) {
        return apiClient.put("reviews/" + review.id, review);
    },

    // delete review for a story

    deleteReview(reviewId) {
        return apiClient.delete("reviews/" +  reviewId);
    }


}
