<template>
  <section>
    <div class="home-welcome-container">
      <div v-if="!isLogged" class="auth-form-container">
        <!-- TODO: use popup design and put icon in header -->
        <!-- <ClientOnly> -->
          <AuthForm />
        <!-- </ClientOnly> -->
      </div>
      <div class="form-and-img-container" :class="{ logged: isLogged }">
        <div style="padding: 0 1rem">
          <h2>
            Welcome to Chord<span style="color: var(--burgundy)">Ex</span>, the ultimate music website!
          </h2>
          <h3>Customize your music library - keep track of songs and store them in one place</h3>
        </div>
        <div class="image-container">
          <img
            src="/assets/img/home_small.webp"
            alt="Guitarist writing notes in a book"
            title="Guitarist writing notes in a book"
            class="responsive-img"
            srcset="
              /assets/img/home_small.webp 430w,
              /assets/img/home_medium.webp 950w,
              /assets/img/home.webp 2000w
              "
              sizes="(max-width: 630px) 300px, 568px"
          />
        </div>
      </div>
    </div>

    <div class="app-preview-container">
      <div class="details-container">
        <div class="details-container-header">
          <h3>ORGANIZE YOUR CHORD PROGRESSIONS AND LYRICS</h3>
          <img src="~/assets/img/playlists.webp" alt="Music notes" title="Songs book" />
        </div>
        <p>Are you tired of losing track of the songs you've learned on your instrument?</p>
        <p>This app is designed specifically for musicians who want an easy and convenient way to store and organize their music.</p>
        <p>Whether you're a beginner or a pro, it has everything you need to take your music to the next level.</p>
        <p><b>Sign up</b> for ChordEx today and start practicing like a pro!</p>
      </div>
      <div class="image-container">

        <img 
        src="~/assets/img/home_cards_small.webp"
        srcset="
        /assets/img/home_cards_small.webp 480w,
        /assets/img/home_cards.webp 1600w
        "
        sizes="(max-width: 768px) 430px, (max-width: 1080px) 500px, 1000px"

        alt="Display of Chordex app features"
        class="app-image"
        />
      </div>
    </div>

   <!-- items -->
   <div class="cards-container">
      <h2>VIRTUAL SONGBOOK FOR ANY MUSICIAN</h2>
      <div class="items">
        <div class="item" style="grid-area: item1;">
          <h3>YouTube video integration</h3>
          <img src="~/assets/img/yt.webp" alt="YouTube music video integration" title="YouTube music video integration" />
          <p>
            Paste YouTube link of a song or a lesson and have it displayed
            together with other song details such as chords, tempo etc.
          </p>
        </div>
        <div class="item" style="grid-area: item2;">
          <h3>Metronome</h3>
          <img src="~/assets/img/metro.webp" alt="Metronome" title="Metronome" />
          <p>
            After inserting tempo (BPM) of each song, you get a feature to play
            metronome and practice at the same time.
          </p>
        </div>
        <div class="item" style="grid-area: item3;">
          <h3>Virtual Songbook</h3>
          <img src="~/assets/img/book.webp" alt="Virtual song book" title="Virtual song book" />
          <p>
            Store all your favorite songs, chord progressions, and lyrics in one place.
          </p>
        </div>
        <div class="item" style="grid-area: item4;">
          <h3>Faster learning</h3>
          <img src="~/assets/img/thinking.webp" alt="Faster learning of an instrument" title="Faster learning of an instrument" />
          <p>
            You can keep track of learned songs and easily recall all of them.
          </p>
        </div>
        <div class="item" style="grid-area: item5;">
          <h3>Playlists</h3>
          <img src="~/assets/img/song_playlists.webp" alt="Song playlists" title="Song playlists" />
          <p>
            Easily organize and find your songs by adding them to custom playlists.
          </p>
        </div>
        <div class="item" style="grid-area: item6;">
          <h3>Song BPM and key</h3>
          <img src="~/assets/img/search.webp" alt="Search information about a song" title="Search information about a song" />
          <p>
            Find the BPM (tempo) and key of any song by typing in the artist and song name.
          </p>
        </div>
      </div>
    </div>
    <!-- products -->
    <div class="features-container">
          <div class="features-image-container">
            <img 
              src="~/assets/img/app_features_ui_small.webp" 
              srcset="
              /assets/img/app_features_ui_small.webp 430w,
              /assets/img/app_features_ui_medium.webp 650w,
              /assets/img/app_features_ui.webp 1640w
              "
              sizes="(max-width: 500px) 300px, (max-width: 800px) 400px, (max-width: 1000px) 500px,  (max-width: 1600px) 600px, 1000px"
              alt="Features and UI of the Chordex website" 
              title="Features and UI of the Chordex website"
               />
          </div>
          <div class="product-info">
            <p>Built-in features:</p>
            <ul>
              <li>Immediately get a song key and BPM</li>
              <li>Insert and watch YouTube video of a song/lesson</li>
              <li>Write and analyze chord progressions</li>
              <li>Built-in metronome</li>
              <li>Add songs to playlists</li>
              <li>Search and filter the songs</li>
              <li>Store often used websites in a list</li>
            </ul>
          </div>
        <!-- </div> -->
      <!-- </div> -->
    </div>    
    <ScrollUp :class="{ show: showBackToTop }" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '~/stores/auth';
import AuthForm from '~/components/auth/AuthForm.vue';
// import ScrollUp from '~/components/ui/ScrollUp.vue';
const ScrollUp = defineAsyncComponent(() => import('~/components/ui/ScrollUp.vue'));
import { useUIStore } from '~/stores/ui';

definePageMeta({
  title: 'Home | Chordex',
  description: 'Customize your music library, keep track of songs and store them at one place with Chordex.',
  canonicalUrl: 'https://chordex.net/home',
});

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUIStore();

const showBackToTop = ref(false);

const isLogged = computed(() => authStore.isAuthenticated);

function showButtonUp() {
  showBackToTop.value = window.scrollY > 800;
}

onMounted(() => {
  if (route.path === '/home') {
    uiStore.removeSidebar();
  }
  window.addEventListener('scroll', showButtonUp);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', showButtonUp);
});
</script>

<style lang="scss" scoped>
.home-welcome-container {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 106.25rem;
  margin: 0 auto;
  height: 100%;
  gap: 1rem;

  .auth-form-container {
    position: relative;
    min-height: 30.625rem;
    // min-height: 490px; TODO: replace after turnstile is added
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  
  .form-and-img-container {
    text-align: center;
    padding-top: 1rem;

    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
  }
  
  @media (min-width: 1000px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      .auth-form-container {
        margin-top: 5.625rem;
      }
      .form-and-img-container {
        grid-column: 2/4;
        padding-top: 5.625rem;
      }
      .form-and-img-container.logged {
        grid-column: 1/4;
      }
  }
}

.app-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .app-image {
      object-fit: contain;

      @media (max-width: 460px) {
        width: 300px;
      }
    }

    .details-container {
      border-top: 6px solid #ff4f5a;
      padding: 1rem;
      position: relative;
      color: var(--dark_blue_sidebar);
      background: #FFE5E6;
      background: linear-gradient(120deg, rgba(255,229,230,1) 0%, rgba(255,229,230,1) 35%, rgba(255,255,255,1) 100%);
      box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

      .details-container-header {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding-bottom: 0.5rem;

        h3 {
          text-align: center;
        }
      }

      p {
        font-size: 1.25rem; 
        margin-bottom: 1rem;
      }

      @media (min-width: 1000px) {
        padding: 1rem 2rem 2rem 2rem; 
        border-radius: 0.75rem;
        border-top: 0;
      }
    }
}
/* card items */
.cards-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #f8f8f8;
  background: linear-gradient(20deg, rgba(242,242,242,1) 0%, rgba(255,255,255,1) 100%);
  margin-top: 1.5rem;
  padding: 1.75rem 0.5rem;
  gap: 1.5rem;
  text-align: center;

  .items {
    padding: 0.5rem;
    display: grid;
    max-width: 1700px;
    margin: 0 auto;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 2rem;
    grid-template-areas:
      "item1"
      "item2"
      "item3"
      "item4"
      "item5"
      "item6";

    @media (min-width: 720px) {
      grid-template-columns: repeat(2, 1fr);
      grid-template-areas:
      "item1 item2"
      "item3 item4"
      "item5 item6";
    }
    @media (min-width: 1350px) {
        grid-template-areas: 
        "item1 item2 item3 item4"
          ". item5 item6 .";
    }
  }
}

.items .item {
  width: 18.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.5rem;
  background-color: #fff;
  gap: 1rem;
  transition: 0.3s ease-in all;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  cursor: pointer;
  padding: 0.875rem;

  &:hover {
    transform: rotateZ(-1deg) scale(1.04);
  }

  p {
    text-align: center;
    color: var(--dark_gray_font);
    line-height: 24px;
  }

  h3 {
    font-size: 1rem;
  }
}
.features-container {
  display: grid;
  justify-content: center;
  
  .products {
    display: grid;
    grid-template-columns: 1fr;
    max-width: 1700px;
    margin: 0 auto;
    
    .product {
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
      justify-items: center;

    }
  }

  @media (min-width: 1000px) {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
}

.features-image-container {
  order: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  img {
    object-fit: contain;
  }
}

.product-info {
  background-color: #fff;
  display: flex;
  color: var(--dark_gray_font);
  flex-direction: column;
  padding: 1.5rem;
  font-size: 20px;
  order: 1;
}
.product-info p {
  font-weight: 600;
  max-width: 500px;
}

.product-info ul {
  list-style: none;
}
.product-info ul li {
  padding-top: 8px;
}
.product-info ul li:before {
  content: "\2714\0020";
  color: var(--green);
}


// IMAGES
.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

@media (max-width: 360px) {
  .responsive-img {
    width: 250px;
  }
}
</style>