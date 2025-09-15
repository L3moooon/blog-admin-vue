<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";

import { h, ref, watch } from "vue";
import { valueUpdater } from "@/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 通用类型定义
export type TableData = Record<string, any>;

import type { VNode } from "vue";

// 自定义列渲染函数类型（返回Vue的VNode）
export type CustomCellRender<T extends TableData> = (props: {
  row: Row<T>;
  cell: any;
}) => VNode;

// 自定义表头渲染函数类型
export type CustomHeaderRender<T extends TableData> = (props: {
  column: any;
  table: ReturnType<typeof useVueTable>;
}) => VNode;

// 扩展行渲染函数类型
export type ExpandedRowRender<T extends TableData> = (data: T) => VNode;

// Props定义
const props = defineProps<{
  /** 表格数据源（泛型数组） */
  data: TableData[];
  /** 列配置（支持自定义渲染） */
  columns: (ColumnDef<TableData> & {
    // 可选：自定义单元格渲染（优先级高于 columnDef.cell）
    customCell?: CustomCellRender<TableData>;
    // 可选：自定义表头渲染（优先级高于 columnDef.header）
    customHeader?: CustomHeaderRender<TableData>;
  })[];
  /** 是否显示行选择框（默认 true） */
  showSelection?: boolean;
  /** 是否显示列显隐控制（默认 true） */
  showColumnToggle?: boolean;
  /** 是否支持行展开（默认 false） */
  enableRowExpand?: boolean;
  /** 扩展行渲染函数（enableRowExpand 为 true 时必传） */
  expandedRowRender?: ExpandedRowRender<TableData>;
  /** 默认排序状态 */
  defaultSorting?: SortingState;
  /** 默认筛选状态 */
  defaultFilters?: ColumnFiltersState;
  /** 默认列显隐状态 */
  defaultColumnVisibility?: VisibilityState;
  /** 默认行展开状态 */
  defaultExpanded?: ExpandedState;
  /** 默认行选择状态 */
  defaultRowSelection?: Record<string, boolean>;
}>();

// Props默认值
withDefaults(props, {
  showSelection: true,
  showColumnToggle: true,
  enableRowExpand: false,
  defaultSorting: () => [],
  defaultFilters: () => [],
  defaultColumnVisibility: () => {},
  defaultExpanded: () => {},
  defaultRowSelection: () => {},
});

// 状态管理
const sorting = ref<SortingState>(props.defaultSorting);
const columnFilters = ref<ColumnFiltersState>(props.defaultFilters);
const columnVisibility = ref<VisibilityState>(props.defaultColumnVisibility);
const rowSelection = ref<Record<string, boolean>>(props.defaultRowSelection);
const expanded = ref<ExpandedState>(props.defaultExpanded);

// 监听外部默认状态变化
watch(
  [
    () => props.defaultSorting,
    () => props.defaultFilters,
    () => props.defaultColumnVisibility,
  ],
  ([newSort, newFilter, newColVis]) => {
    sorting.value = newSort;
    columnFilters.value = newFilter;
    columnVisibility.value = newColVis;
  },
  { deep: true }
);

// 列配置处理
const processedColumns = ref<ColumnDef<TableData>[]>([]);
watch(
  () => props.columns,
  (newColumns) => {
    let baseColumns = [...newColumns];

    // 注入「行选择列」
    if (props.showSelection) {
      baseColumns.unshift({
        id: "select",
        header: ({ table }) =>
          h(Checkbox, {
            modelValue:
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate"),
            "onUpdate:modelValue": (value) =>
              table.toggleAllPageRowsSelected(!!value),
            ariaLabel: "Select all",
          }),
        cell: ({ row }) =>
          h(Checkbox, {
            modelValue: row.getIsSelected(),
            "onUpdate:modelValue": (value) => row.toggleSelected(!!value),
            ariaLabel: "Select row",
          }),
        enableSorting: false,
        enableHiding: false,
      });
    }

    // 合并自定义渲染
    processedColumns.value = baseColumns.map((col) => ({
      ...col,
      header: col.customHeader
        ? (props) => col.customHeader!(props)
        : col.header,
      cell: col.customCell ? (props) => col.customCell!(props) : col.cell,
    }));
  },
  { immediate: true, deep: true }
);

// TanStack Table 实例化
const table = useVueTable({
  data: ref(props.data),
  columns: processedColumns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updater) => valueUpdater(updater, sorting),
  onColumnFiltersChange: (updater) => valueUpdater(updater, columnFilters),
  onColumnVisibilityChange: (updater) =>
    valueUpdater(updater, columnVisibility),
  onRowSelectionChange: (updater) => valueUpdater(updater, rowSelection),
  onExpandedChange: (updater) => valueUpdater(updater, expanded),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
  },
  getRowId: (row) => row.original.id || `row-${row.index}`,
});

// 暴露给父组件的方法/状态
defineExpose({
  tableInstance: table,
  sorting,
  columnFilters,
  rowSelection,
  expanded,
  toggleAllRows: (value: boolean) => table.toggleAllPageRowsSelected(value),
  clearFilters: () => table.clearColumnFilters(),
  resetSorting: () => table.resetSorting(),
});

// 内部工具方法
const getColumnFilterValue = (columnId: string) => {
  return table.getColumn(columnId)?.getFilterValue() as string;
};

const setColumnFilterValue = (columnId: string, value: string) => {
  table.getColumn(columnId)?.setFilterValue(value);
};
</script>

<template>
  <div class="w-full">
    <!-- 顶部工具栏：筛选 + 列显隐控制 -->
    <div class="flex flex-wrap gap-2 items-center py-4">
      <!-- 插槽：自定义工具栏 -->
      <slot
        name="toolbar"
        :getColumnFilterValue="getColumnFilterValue"
        :setColumnFilterValue="setColumnFilterValue" />

      <!-- 列显隐控制 -->
      <DropdownMenu
        v-if="showColumnToggle"
        class="ml-auto">
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            Columns <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table
              .getAllColumns()
              .filter((col) => col.getCanHide())"
            :key="column.id"
            class="capitalize"
            :model-value="column.getIsVisible()"
            @update:model-value="(value) => column.toggleVisibility(!!value)">
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- 表格主体 -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- 有数据时渲染行 -->
          <template v-if="table.getRowModel().rows?.length">
            <template
              v-for="row in table.getRowModel().rows"
              :key="row.id">
              <!-- 主行 -->
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()" />
                </TableCell>
              </TableRow>

              <!-- 扩展行 -->
              <TableRow v-if="enableRowExpand && row.getIsExpanded()">
                <TableCell
                  :colspan="row.getAllCells().length"
                  class="p-4 bg-muted/50">
                  <slot
                    name="expandedRow"
                    :data="row.original" />
                  <template v-if="!$slots.expandedRow && expandedRowRender">
                    {{ expandedRowRender(row.original) }}
                  </template>
                </TableCell>
              </TableRow>
            </template>
          </template>

          <!-- 无数据时渲染空状态 -->
          <TableRow v-else>
            <TableCell
              :colspan="processedColumns.length"
              class="h-24 text-center">
              <slot name="emptyState">No results.</slot>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- 底部分页栏 -->
    <div class="flex flex-wrap items-center justify-between gap-2 py-4">
      <!-- 选中行统计 -->
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>

      <!-- 分页控制 -->
      <div class="flex items-center gap-2">
        <slot
          name="pagination"
          :table="tableInstance" />

        <!-- 默认分页按钮 -->
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()">
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()">
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
