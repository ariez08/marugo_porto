import axios from "axios";
axios.defaults.withCredentials = true;

// const BASE_URL = "https://marugo-porto.vercel.app/api";
const BASE_URL = "http://localhost:90"
// const BASE_URL = "http://localhost:3000/api"

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

interface User {
  username: string;
  email?: string;
  password: string;
}

export const loginUser = async (
  user: Pick<User, "username" | "password">
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      {
        username: user.username,
        password: user.password,
      },
      { withCredentials: true } // penting!
    );

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

export const getCurrentUser = async (): Promise<{ username: string }> => {
  try {
    const res = await axios.get(`${BASE_URL}/me`, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Not authenticated");
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

export const logoutUser = async (): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${BASE_URL}/logout`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to logout"
    );
  }
};
  
export const fetchAllImages = async (): Promise<ImageData[]> => {
  try {
    const response = await axios.get<ImageData[]>(`${BASE_URL}/images`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch images"
    );
  }
};

export const deleteImageById = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/imgdel/${id}`, {
      withCredentials: true,
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete image"
    );
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

export const fetchCrouselItems = async (): Promise<CarouselData[]> => {
  try {
    const response = await axios.get<CarouselData[]>(`${BASE_URL}/carousel`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch carousel items"
    );
  }
}