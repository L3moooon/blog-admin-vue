<script setup lang="ts">
import User from "./widgets/User.vue";
import ToggleTheme from "./widgets/ToggleTheme.vue";
import Message from "./widgets/Message.vue";
</script>
<template>
  <div class="!ml-auto flex h-12 gap-3">
    <ToggleTheme />
    <Message />
    <User />
  </div>
</template>
