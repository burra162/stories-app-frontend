import apiClient from "./services";

export default {
  getUser() {
    return apiClient.get("users");
  },
  addUser(user) {
    return apiClient.post("users", user);
  },
  loginUser(user) {
    console.log(user);
    return apiClient.post("login", user.value, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.value.email + ":" + user.value.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  },
  updateUser(user) {
    return apiClient.put("users/" + user.id, user);
  },
  resetPassword(user) {
    return apiClient.post("users/reset-password", user);
  },
  updateGenres(userId, genres) {
    return apiClient.put("users/" + userId + "/genres", genres);
  },
  getUserGenres(userId) {
    return apiClient.get("users/" + userId + "/genres");
  },

  deleteUser(userId) {
    return apiClient.delete("users/" + userId);
  }
};
