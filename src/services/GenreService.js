import apiClient from "./services";


export default {
    getGenres() {
        return apiClient.get("genres");
    },
    addGenre(genre) {
        return apiClient.post("genres", genre);
    },
    updateGenre(genre) {
        return apiClient.put("genres/" + genre.id, genre);
    }
}
