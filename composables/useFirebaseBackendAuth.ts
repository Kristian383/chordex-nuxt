import { useAuthStore } from "@/stores/auth";

export function useFirebaseBackendAuth() {
  const authStore = useAuthStore();
  const firebaseBackendAuth = async (google_token: string): Promise<{ success: boolean; message: string }> => {
    const { apiUrl } = useApiUrl();
    const url = apiUrl("firebase");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Timeout after 5 seconds

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ google_token }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const responseData = await response.json();

      if (!response.ok) {
        return { message: responseData.message || "Failed to authenticate with the server.", success: false };
      }

      // Set user in store
      authStore.setUserAndLoadData(responseData);

      return { success: true, message: "Authentication successful." };
    } catch (error: unknown) {
      clearTimeout(timeout);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return { success: false, message: "Request timed out. Please try again." };
        }
        return { success: false, message: error.message };
      }

      return { success: false, message: "An unexpected error occurred." };    }
  };

  return { firebaseBackendAuth };
}
