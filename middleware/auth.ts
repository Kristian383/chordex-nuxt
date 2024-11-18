import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
    console.log('Navigating from:', from.path);
    console.log('Navigating to:', to.path);

    const authStore = useAuthStore();
  
    if (to.meta.requiresAuth && !authStore.token) {
      console.warn('User not authenticated, redirecting to login.');
      return navigateTo('/login');
    }
});
  