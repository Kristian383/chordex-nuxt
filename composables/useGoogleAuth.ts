// composables/useGoogleAuth.ts
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNuxtApp } from "#app";

export function useGoogleAuth() {
  const { $firebaseAuth } = useNuxtApp();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");

    let response: Record<string, any> = {};

    try {
      const result = await signInWithPopup($firebaseAuth, provider);
      const user = result.user;

      response.google_token = await user.getIdToken(); // Fetch Firebase ID token
      response.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      response.msg = "Success.";
    } catch (error: any) {
      response.google_token = null;

      switch (error.code) {
        case "auth/user-not-found":
          response.msg = "User not found.";
          break;
        case "auth/wrong-password":
          response.msg = "Wrong password.";
          break;
        case "auth/popup-closed-by-user":
          response.msg = "You closed the popup window.";
          break;
        default:
          response.msg = "Something went wrong. Please try again.";
      }
    }

    return response;
  };

  return { signInWithGoogle };
}
