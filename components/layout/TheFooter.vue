<template>
  <footer id="footer">
    <div class="container">
      <NuxtLink href="https://ko-fi.com/I2I0JPDGB">
        <img
          height="36"
          width="144"
          style="border:0px;height:36px;"
          src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
          border="0"
          alt="Buy Me a Coffee at ko-fi.com"
        >
      </NuxtLink>
      <span>&copy; Kristian Nenadović 2024</span>
      <div class="spotify-logo">
        <img src="~/assets/img/spotify.webp" alt="Spotify music for song information" title="Spotify music" >
      </div>
      <NuxtLink class="free-pick-link" to="https://www.freepik.com/vectors/banner">
        Photos by Freepik
      </NuxtLink>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  background-color: var(--f1_gray);
  margin-top: auto;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  padding: 1.25rem;
  max-width: 71.25rem;
  margin: 0 auto;

  .spotify-logo {
    width: 6rem;
    img {
      width: 100%;
    }
  }
  .free-pick-link {
    text-decoration: none;
    color: black;
    font-size: 0.75rem;
  }
}
</style>