import axios, { isAxiosError } from "axios";
axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === "object") {
      if ("error" in data && typeof data.error === "string") return data.error;
      if ("message" in data && typeof data.message === "string") return data.message;
    }
    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export interface ImageData {
  id: number;
  name: string;
  category: string;
  description: string;
  url: string;
}

export interface CarouselData {
  id: number;
  main_url: string;
  left_url: string;
  right_url: string;
  category: string;
  description: string;
  alt_text: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface User {
  username: string;
  email?: string;
  password: string;
}

export interface UserItem {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export const loginUser = async (
  user: Pick<User, "username" | "password">
): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${BASE_URL}/login`,
      {
        username: user.username,
        password: user.password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Login failed"));
  }
};

export const createUser = async (user: User): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(`${BASE_URL}/users`, user, { withCredentials: true });
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "User creation failed"));
  }
};

export const fetchUsers = async (): Promise<UserItem[]> => {
  try {
    const res = await axios.get<UserItem[]>(`${BASE_URL}/users`, { withCredentials: true });
    return res.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Gagal memuat daftar user"));
  }
};

export const deleteUserById = async (id: number): Promise<{ message: string }> => {
  try {
    const res = await axios.delete<{ message: string }>(`${BASE_URL}/users/${id}`, { withCredentials: true });
    return res.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Gagal menghapus user"));
  }
};

export const updateUserById = async (
  id: number,
  data: { email?: string; password?: string }
): Promise<{ message: string }> => {
  try {
    const res = await axios.put<{ message: string }>(`${BASE_URL}/users/${id}`, data, { withCredentials: true });
    return res.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Gagal memperbarui user"));
  }
};

export const getCurrentUser = async (): Promise<{ username: string }> => {
  try {
    const res = await axios.get<{ username: string }>(`${BASE_URL}/me`, { withCredentials: true });
    return res.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Not authenticated"));
  }
};

export const uploadImage = async (formData: FormData): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(`${BASE_URL}/imgupl`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to upload image"));
  }
};

export const logoutUser = async (): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${BASE_URL}/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to logout"));
  }
};

export const fetchAllImages = async (): Promise<ImageData[]> => {
  try {
    const response = await axios.get<ImageData[]>(`${BASE_URL}/images`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to fetch images"));
  }
};

export const deleteImageById = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/imgdel/${id}`, {
      withCredentials: true,
    });
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to delete image"));
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(`${BASE_URL}/categories`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to fetch categories"));
  }
};

export const fetchCrouselItems = async (): Promise<CarouselData[]> => {
  try {
    const response = await axios.get<CarouselData[]>(`${BASE_URL}/carousel`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to fetch carousel items"));
  }
};
