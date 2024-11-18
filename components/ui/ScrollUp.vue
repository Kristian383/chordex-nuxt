<template>
  <div
    class="scroll-top"
    aria-hidden="true"
    @click="scrollUp"
  >
    <div class="arrow">
      <client-only>
        <font-awesome-icon icon="arrow-up" />
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
function scrollUp() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
.scroll-top {
  display: inline-block;
  background: #222;
  height: 0px;
  width: 0px;
  position: fixed;
  bottom: 30px;
  right: 30px;
  text-align: center;
  border-radius: 50px;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  opacity: 0;
  visibility: hidden;
  position: fixed;
  cursor: pointer;
  color: var(--white);
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  right: 50px;
  bottom: 75px;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
}
.scroll-top:hover {
  transform: scale(1.1);
}
.scroll-top > div.arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  opacity: 1;
  font-size: 24px;
}
.scroll-top.show {
  opacity: 1;
  visibility: visible;
  width: 50px;
  height: 50px;
}
</style>
