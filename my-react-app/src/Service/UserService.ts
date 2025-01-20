import axiosJWT from "../Utiles/axiosJWT";

const API_BASE_URL = 'http://localhost:8080/api/users';

export async function getCurrentUser(token: string): Promise<unknown> {
  const response = await axiosJWT.get(`${API_BASE_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateUserDetails(
  token: string,
  newEmail?: string,
  newPassword?: string
): Promise<{ message: string }> {
  const response = await axiosJWT.put(
    `${API_BASE_URL}/update`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { newEmail, newPassword },
    }
  );
  return response.data;
}

export async function addFavoriteRecipe(
  token: string,
  userId: number,
  recipeId: number
): Promise<{ message: string }> {
  const response = await axiosJWT.post(
    `${API_BASE_URL}/${userId}/favorites/${recipeId}`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function updatePassword(token: string, newPassword: string): Promise<{ message: string }> {
  const response = await axiosJWT.put(
    `${API_BASE_URL}/update-password`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { newPassword },
    }
  );
  return response.data;
}

export async function removeFavoriteRecipe(
  token: string,
  userId: number,
  recipeId: number
): Promise<{ message: string }> {
  const response = await axiosJWT.delete(
    `${API_BASE_URL}/${userId}/favorites/${recipeId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

// Ensure all functions are part of the default export
export default {
  getCurrentUser,
  updateUserDetails,
  addFavoriteRecipe,
  updatePassword, // Add `updatePassword` here
  removeFavoriteRecipe,
};
