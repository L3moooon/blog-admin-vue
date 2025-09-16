<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Appearance from "./Appearance.vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Settings } from "lucide-vue-next";
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Settings
        class="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" />
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle class="!p-4">偏好设置</SheetTitle>
        <Separator />
        <SheetDescription>
          <ScrollArea class="h-185">
            <Tabs
              default-value="appearance"
              class="w-full !px-4 !my-3">
              <TabsList class="!p-1 w-full">
                <TabsTrigger
                  class="cursor-pointer"
                  value="appearance">
                  外观
                </TabsTrigger>
                <TabsTrigger
                  class="cursor-pointer"
                  value="layout">
                  布局
                </TabsTrigger>
                <TabsTrigger
                  class="cursor-pointer"
                  value="shortcut">
                  快捷键
                </TabsTrigger>
                <TabsTrigger
                  class="cursor-pointer"
                  value="common">
                  通用
                </TabsTrigger>
              </TabsList>
              <TabsContent value="appearance"> <Appearance /> </TabsContent>
              <TabsContent value="layout"> layout </TabsContent>
              <TabsContent value="shortcut"> shortcut </TabsContent>
              <TabsContent value="common"> common </TabsContent>
            </Tabs>
          </ScrollArea>
        </SheetDescription>
        <Separator />
        <div>
          <Button>重置</Button>
          <Button>保存</Button>
        </div>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>
