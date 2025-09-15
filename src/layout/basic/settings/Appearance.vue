<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
</script>
<template>
  <Form>
    <FormField
      v-slot="{ componentField }"
      name="username">
      <FormItem>
        <FormLabel class="!font-bold text-xl !mt-3">主题</FormLabel>
        <FormControl>
          <RadioGroup default-value="light">
            <div class="flex items-center space-x-2">
              <RadioGroupItem
                id="light"
                value="light" />
              <Label for="light">浅色</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem
                id="dark"
                value="dark" />
              <Label for="dark">深色</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem
                id="system"
                value="system" />
              <Label for="system">跟随系统</Label>
            </div>
          </RadioGroup>
          <div class="flex items-center space-x-2">
            <Label for="airplane-mode">深色侧边栏</Label>
            <Switch id="airplane-mode" />
          </div>
          <div class="flex items-center space-x-2">
            <Label for="airplane-mode">深色顶栏</Label>
            <Switch id="airplane-mode" />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </Form>
</template>
