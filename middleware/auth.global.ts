import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
    console.log('Navigating from:', from);
    console.log('Navigating to:', to);

    const authStore = useAuthStore();
  
    if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
      console.warn('User not authenticated, redirecting to login.');
      return navigateTo('/');
    } 
});
  