<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Backup from "./Backup.vue";
import Reboot from "./Reboot.vue";
import Status from "./Status.vue";
</script>
<template>
	<div>
		<div class="px-5 py-4 border-b">
			<div class="flex">
				<div class="text-xl font-200">定时任务</div>
				<div class="text-sm text-gray-500 ml-2 mt-1.5">
					本页用于查看定时脚本执行情况
				</div>
			</div>
		</div>
		<div class="px-5 py-4">
			<Tabs default-value="status">
				<TabsList>
					<TabsTrigger value="status"> 服务器状态 </TabsTrigger>
					<TabsTrigger value="reboot"> 服务器重启 </TabsTrigger>
					<TabsTrigger value="backup"> 数据库备份 </TabsTrigger>
				</TabsList>
				<TabsContent value="status">
					<Status />
				</TabsContent>
				<TabsContent value="reboot"> <Reboot /> </TabsContent>
				<TabsContent value="backup"><Backup /> </TabsContent>
			</Tabs>
		</div>
	</div>
</template>
