<script setup lang="ts">
import { h } from "vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Payment } from "./PaymentTableDemo.vue";

// 接收支付数据和展开回调
const props = defineProps<{
  payment: Payment;
  onExpand: () => void;
}>();

// 示例：处理支付操作的方法
const handleViewDetails = () => {
  console.log("View details for payment:", props.payment.id);
  // 可以在这里添加查看详情的逻辑
};

const handleRefund = () => {
  console.log("Refunding payment:", props.payment.id);
  // 可以在这里添加退款逻辑
};

const handleEdit = () => {
  console.log("Editing payment:", props.payment.id);
  // 可以在这里添加编辑逻辑
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8">
        <MoreHorizontal class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="handleViewDetails">
        View details
      </DropdownMenuItem>
      <DropdownMenuItem @click="onExpand"> Toggle expanded </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleEdit"> Edit </DropdownMenuItem>
      <DropdownMenuItem
        @click="handleRefund"
        class="text-destructive focus:text-destructive">
        Refund
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
