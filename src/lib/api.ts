import { create } from "zustand";

// APIの状態管理
interface ApiState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useApiStore = create<ApiState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

// APIクライアントの設定
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// 共通のAPIクライアント
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { setLoading } = useApiStore.getState();

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // GET リクエスト
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST リクエスト
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT リクエスト
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE リクエスト
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // PATCH リクエスト
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// シングルトンインスタンス
export const api = new ApiClient();

// 便利な関数
export const appApi = {
  // 食材関連
  ingredients: {
    getAll: () => api.get<{ ingredients: any[] }>("/api/ingredients"),
    save: (ingredients: string[]) =>
      api.post<{ message: string; ingredients: any[] }>("/api/ingredients", {
        ingredients,
      }),
    seed: () =>
      api.post<{ message: string; count: number; ingredients: any[] }>(
        "/api/ingredients/seed"
      ),
  },

  // レシピ関連
  recipes: {
    getAll: () => api.get<{ recipes: any[] }>("/api/recipes"),
    getById: (id: string) => api.get<{ recipe: any }>(`/api/recipes/${id}`),
    create: (data: any) => api.post<{ recipe: any }>("/api/recipes", data),
    update: (id: string, data: any) =>
      api.put<{ recipe: any }>(`/api/recipes/${id}`, data),
    delete: (id: string) =>
      api.delete<{ message: string }>(`/api/recipes/${id}`),
  },

  // ユーザー関連
  users: {
    getProfile: () => api.get<{ user: any }>("/api/users/profile"),
    updateProfile: (data: any) =>
      api.put<{ user: any }>("/api/users/profile", data),
  },

  // 認証関連
  auth: {
    login: (credentials: { email: string; password: string }) =>
      api.post<{ token: string; user: any }>("/api/auth/login", credentials),
    logout: () => api.post<{ message: string }>("/api/auth/logout"),
    register: (data: { email: string; password: string; name: string }) =>
      api.post<{ user: any }>("/api/auth/register", data),
  },

  // 画像生成・分析関連
  images: {
    generate: (prompt: string) =>
      api.post<{ imageUrl: string }>("/api/generate-image", { prompt }),
    analyze: (files: FormData) =>
      api.post<{ ingredients: string[] }>("/api/analyze-image", files),
    analyzeWithFilename: (filename: string, file: File) =>
      api.post<{ url: string }>(
        `/api/analyze-image?filename=${encodeURIComponent(filename)}`,
        file
      ),
  },

  // レシピ保存
  saveRecipe: (recipeData: any) =>
    api.post<{ id: string; message: string }>("/api/save-recipe", recipeData),
};
