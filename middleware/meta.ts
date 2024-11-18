export default defineNuxtRouteMiddleware((to) => {
    // Set page title
    useHead({
      title: to.meta.title || 'Chordex',
      meta: [
        { name: 'description', content: to.meta.description || '' },
        { rel: 'canonical', href: to.meta.canonicalUrl || '' },
      ],
    });
  });
  