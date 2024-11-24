export function useApiUrl() {
    const config = useRuntimeConfig();
  
    const apiUrl = (path: string): string => {
      const base = config.public.apiBase || "";

      const newPath = base ? `${base}/${path}` : path;
      const domain = config.public.apiDomain;

      return new URL(newPath, domain).toString();
    };
  
    return { apiUrl };
  }
  