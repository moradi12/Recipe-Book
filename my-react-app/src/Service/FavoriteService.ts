import axios from "axios";

class FavoriteService {
  private baseUrl = "http://localhost:8080/api/favorites"; 
  // Adjust this to match your backend endpoint

  public getFavorites(token: string) {
    return axios.get(this.baseUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  public addFavorite(token: string, recipeId: number) {
    return axios.post(
      `${this.baseUrl}/${recipeId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  public removeFavorite(token: string, recipeId: number) {
    return axios.delete(`${this.baseUrl}/${recipeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export default new FavoriteService();
