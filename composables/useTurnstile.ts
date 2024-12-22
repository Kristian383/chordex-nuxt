export const useTurnstile = () => {
  const verifyTurnstile = async (captchaToken: string): Promise<boolean> => {
    try {
      const response: { success: boolean } = await $fetch('/api/auth/verify-turnstile', {
        method: 'POST',
        body: { captchaToken },
      });

      return response.success;
    } catch (error) {
      console.error('Turnstile verification failed:', error);
      return false;
    }
  };

  return { verifyTurnstile };
};
