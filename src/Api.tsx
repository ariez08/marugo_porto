import axios from "axios";

const BASE_URL = "https://marugo-porto.vercel.app/api";
// const BASE_URL = "http://localhost:8080"

export interface ImageData {
  id: number;
  name: string;
  description: string;
  url: string;
}

export interface Category {
  id: number;
  name: string;
}

interface User {
  username: string;
  email?: string;
  password: string;
}

export const loginUser = async (user: Pick<User, "username" | "password">): Promise<{ message: string; username: string }> => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      username: user.username,
      password: user.password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || "Login failed");
    } else {
      throw new Error("Network error");
    }
  }
};

export const createUser = async (user: User): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${BASE_URL}/create`, user);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || "User creation failed");
    } else {
      throw new Error("Network error");
    }
  }
};

export const uploadImage = async (formData: FormData): Promise<{ message: string }> => {
    try {
      const response = await axios.post(`${BASE_URL}/imgupl`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }
  };
  
  export const fetchAllImages = async (): Promise<ImageData[]> => {
    try {
      const response = await axios.get<ImageData[]>(`${BASE_URL}/images`, {withCredentials: true}); 
      console.log("Images fetched successfully:", response.data);
      
      return response.data; 
    } catch (error: any) {
      console.error("Error fetching images:", error.response || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch images"
      );
    }
  };

  export const deleteImageById = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${BASE_URL}/imgdel/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete image");
    }
  };

export const fetchCategories = async () => {
  try {
    const response = await axios.get<Category[]>(`${BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};
  