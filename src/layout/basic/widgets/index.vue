<script setup lang="ts">
import User from "./User.vue";
import ToggleTheme from "./ToggleTheme.vue";
import Message from "./Message.vue";
import Settings from "./Settings.vue";
</script>
<template>
  <div class="!ml-auto flex h-12 gap-3">
    <Settings />
    <ToggleTheme />
    <Message />
    <User />
  </div>
</template>
