<template>
  <div class="box">
    <div class="loader-02"></div>
  </div>
</template>

<script>
</script>

<style scoped>
.box {
  display: inline-block;
  width: 100%;
  height: 6.25rem;
  text-align: center;
  font-size: 1.875rem;
  padding: 1em;
  position: relative;
  transition: 0.3s color, 0.3s border, 0.3s transform, 0.3s opacity;
}
[class*="loader-"] {
  display: inline-block;
  width: 1em;
  height: 1em;
  color: inherit;
  vertical-align: middle;
  pointer-events: none;
}

.loader-02 {
  border: 0.2em solid transparent;
  border-left-color: currentcolor;
  border-right-color: currentcolor;
  border-radius: 50%;
  -webkit-animation: 1s loader-02 linear infinite;
  animation: 1s loader-02 linear infinite;
}

@-webkit-keyframes loader-02 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loader-02 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>