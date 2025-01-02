import { defineStore } from 'pinia';
import  { jwtDecode } from "jwt-decode";

interface AuthStatusResponse {
  authenticated: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  message?: string;
}


interface State {
  token: string | null;
  user: Record<string, any>;
  isLoggedIn: boolean;
  cookieConsent: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    user: {},
    token: null,
    isLoggedIn: false,
    cookieConsent: null,
  }),

  getters: {
      isAuthenticated(state) {
        return state.isLoggedIn;
      },
      getUser(state) {
        return state.user;
      },
      hasCookieConsent(state) {
        return state.cookieConsent || localStorage.getItem("cookieConsent");
      },
  },

  actions: {
    setUser(user: Record<string, any>) {
      this.user = user;
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      this.user = {};
      this.token = null;
      this.isLoggedIn = false;
      navigateTo("/");
    },

    async authenticateUser(payload: { mode: string; user: { email: string; password: string; username?: string } }) {
      const { apiUrl } = useApiUrl();

      const url = payload.mode === "signup" ? apiUrl("register") : apiUrl("login");

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload.user),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || "Authentication failed");
        }

        const responseData = await response.json();
        this.setUserAndLoadData(responseData);
        return { success: true, message: "Authentication successful" };
      } catch (error) {
        console.error("Authentication error:", error);
        return { success: false, message: (error as Error).message || "An unexpected error occurred" };
      }
    },

    async setUserAndLoadData(payload: { user: string; token: string; email: string }) {
      const { user, token, email } = payload;

      localStorage.setItem("token", token);
      localStorage.setItem("username", user);
      localStorage.setItem("email", email);

      // Update the store state
      this.user = { username: user, email };
      this.token = token;
      this.isLoggedIn = true;
    },

    async checkAuthStatus(): Promise<boolean> {
      const { apiUrl } = useApiUrl();
      
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        if (!token || !email) {
          console.warn("Token or email is missing in localStorage.");
          return false;
        }

        const response = await $fetch<AuthStatusResponse>(apiUrl("auth-status"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email }),
        });

        if (response?.authenticated) {
          this.isLoggedIn = true;
          return true;
        } else {
          console.warn("Authentication check failed:", response.message || "Unknown error");
          this.isLoggedIn = false;
          return false;
        }
      } catch (error) {
          console.error('Error validating token with backend:', error);
          this.isLoggedIn = false;
          return false;
      }
  },

    async forgotPassword(email: string) {
      const url = new URL("api/forgotpassword", process.env.VUE_APP_URL);

      let response;
      try {
        response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
      } catch (error) {
        console.error(error);
        return "error";
      }
      return response.ok;
    },

    async resetPassword(payload: { token: string; new: string; email: string }) {
      const url = new URL(`api/resetpassword/${payload.token}`, process.env.VUE_APP_URL);

      const expiresIn = jwtDecode(payload.token).exp;
      const currentTime = Math.round(Date.now() / 1000);

      if (expiresIn && expiresIn - currentTime < 0) {
        return "expired";
      }

      let response;
      try {
        response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new: payload.new, email: payload.email }),
        });
      } catch (error) {
        console.error(error);
        return;
      }

      const responseData = await response.json();
      return responseData.message;
    },

    async contactMe(payload: { email: string; message: string }) {
      const url = new URL("api/contactme", process.env.VUE_APP_URL);

      let response;
      try {
        response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error(error);
        return false;
      }
      return response.ok;
    },

    async requestDeleteAccount(payload: { email: string }) {
      const url = new URL("api/delete-acc-request", process.env.VUE_APP_URL);

      let response;
      try {
        response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(payload),
        });
      } catch {
        return "error";
      }
      return response.ok;
    },

    async deleteAccount(payload: { token: string; email: string }) {
      const url = new URL(`api/delete-acc/${payload.token}`, process.env.VUE_APP_URL);

      const expiresIn = jwtDecode(payload.token).exp;
      const currentTime = Math.round(Date.now() / 1000);

      if (expiresIn && expiresIn - currentTime < 0) {
        return "expired";
      }

      let response;
      try {
        response = await fetch(url.toString(), {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ email: payload.email }),
        });
      } catch {
        return { success: false };
      }

      const responseData = await response.json();
      if (!response.ok) {
        return { success: false, message: responseData.message };
      }
      return { success: true, message: "ok" };
    },
  },
});
