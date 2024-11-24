import { defineStore } from 'pinia';
import  { jwtDecode } from "jwt-decode";

// import { actions } from './actions';

// import { auth } from "@/firebase";
// import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// interface User {
//   username: string;
//   email: string;
// }

interface State {
  token: string | null;
  user: Record<string, any>;
  didAutoLogout: boolean;
  cookieConsent: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    user: {},
    token: null,
    didAutoLogout: false,
    cookieConsent: null,
  }),

  getters: {
      isAuthenticated(state) {
        return !!state.token;
      },
      hasAutoLoggedOut(state) {
        return state.didAutoLogout;
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
      this.didAutoLogout = false;
      // TODO:: call to clear other states (clearVuex in old project)
    },

    async authenticateUser(payload: { mode: string; user: { email: string; password: string; username?: string } }) {
      const { apiUrl } = useApiUrl();

      const url = payload.mode === "signup" ? apiUrl("register") : apiUrl("login");

      let response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload.user),
        });
      } catch (error) {
        console.error(error);
        return "There was an error!";
      }

      const responseData = await response.json();
      if (!response.ok) {
        return responseData.message;
      }

      this.setUserAndLoadData({ ...responseData, email: payload.user.email });
    },

    // TODO: pinia
    // async signInWithGoogle() {
    //   const provider = new GoogleAuthProvider();
    //   provider.addScope("profile");
    //   provider.addScope("email");

    //   let response: Record<string, any> = {};

    //   try {
    //     await signInWithPopup(auth, provider).then((result) => {
    //       const user = result.user;
    //       response.google_token = user.accessToken;
    //       response.msg = "Success.";
    //     });
    //   } catch (error: any) {
    //     response.google_token = false;

    //     switch (error.code) {
    //       case "auth/user-not-found":
    //         response.msg = "User not found";
    //         break;
    //       case "auth/wrong-password":
    //         response.msg = "Wrong password";
    //         break;
    //       case "auth/popup-closed-by-user":
    //         response.msg = "You closed the popup window.";
    //         break;
    //       default:
    //         response.msg = "Something went wrong";
    //     }
    //   }
    //   return response;
    // },

    async firebaseBackendCall(google_token: string) {
      const url = new URL("api/firebase", process.env.VUE_APP_URL);

      let response;
      try {
        response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ google_token }),
        });
      } catch {
        return { message: "Something went wrong.", success: false };
      }

      const responseData = await response.json();
      if (!response.ok) {
        return { message: responseData.message, success: false };
      }

      this.setUserAndLoadData(responseData);
      return { success: true, message: "ok" };
    },

    async setUserAndLoadData(payload: { user: string; token: string; email: string }) {
      localStorage.setItem("token", payload.token);
      localStorage.setItem("username", payload.user);
      localStorage.setItem("email", payload.email);

      this.user = { username: payload.user, email: payload.email };
      this.token = payload.token;

      // Load additional data if necessary
    },

    async tryLogin() {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
  
      if (!token) return;

      const expiresIn = jwtDecode(token).exp;
      
      const currentTime = Math.round(Date.now() / 1000);

      if (expiresIn && expiresIn - currentTime < 0) {
        this.autoLogout();
      } else {
        this.user = { username, email };
        this.token = token;
      }
    },

    autoLogout() {
      this.logout();
      this.didAutoLogout = true;
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
