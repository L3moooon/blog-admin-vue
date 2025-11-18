<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import type { DateRange } from "reka-ui";

import type { Grid } from "reka-ui/date";
import type { Ref } from "vue";
import { CalendarDate, isEqualMonth } from "@internationalized/date";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { RangeCalendarRoot, useDateFormatter } from "reka-ui";
import { createMonth, toDate } from "reka-ui/date";
import { ref, watch } from "vue";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	RangeCalendarCell,
	RangeCalendarCellTrigger,
	RangeCalendarGrid,
	RangeCalendarGridBody,
	RangeCalendarGridHead,
	RangeCalendarGridRow,
	RangeCalendarHeadCell,
} from "@/components/ui/range-calendar";

const value = ref({
	// start: new CalendarDate(2024, 8, 25),
	// end: new CalendarDate(2024, 11, 20).add({ days: 20 }),
	start: undefined,
	end: undefined,
}) as Ref<DateRange>;

const emit = defineEmits<{
	(e: "update:dateRange", range: Array<Date>): void;
}>();

// 监听日期范围变化，触发事件通知父组件
watch(
	value,
	(newRange) => {
		console.log("变化", newRange);
		if (!newRange.end) return;
		// console.log(toDate(newRange.start).getTime());
		const arr = [toDate(newRange.start), toDate(newRange.end)];
		// 当 start 或 end 有一个变化时，就通知父组件
		emit("update:dateRange", arr);
	},
	{ deep: true } // 深度监听对象内部变化
);
const locale = ref("zh-cn");
const formatter = useDateFormatter(locale.value);

// const placeholder = ref(value.value.start) as Ref<DateValue>;
// const secondMonthPlaceholder = ref(value.value.end) as Ref<DateValue>;

const y = new Date().getFullYear();
const m = new Date().getMonth();
const d = new Date().getDay();
console.log(y, m, d);
const today = new CalendarDate(y, m, d);
const placeholder = ref(today) as Ref<DateValue>;
const secondMonthPlaceholder = ref(today.add({ months: 1 })) as Ref<DateValue>;

const firstMonth = ref(
	createMonth({
		dateObj: placeholder.value,
		locale: locale.value,
		fixedWeeks: true,
		weekStartsOn: 1,
	})
) as Ref<Grid<DateValue>>;
const secondMonth = ref(
	createMonth({
		dateObj: secondMonthPlaceholder.value,
		locale: locale.value,
		fixedWeeks: true,
		weekStartsOn: 1,
	})
) as Ref<Grid<DateValue>>;

function updateMonth(reference: "first" | "second", months: number) {
	if (reference === "first") {
		placeholder.value = placeholder.value.add({ months });
	} else {
		secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
			months,
		});
	}
}

watch(placeholder, (_placeholder) => {
	firstMonth.value = createMonth({
		dateObj: _placeholder,
		weekStartsOn: 1,
		fixedWeeks: false,
		locale: locale.value,
	});
	if (isEqualMonth(secondMonthPlaceholder.value, _placeholder)) {
		secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
			months: 1,
		});
	}
});

watch(secondMonthPlaceholder, (_secondMonthPlaceholder) => {
	secondMonth.value = createMonth({
		dateObj: _secondMonthPlaceholder,
		weekStartsOn: 1,
		fixedWeeks: false,
		locale: locale.value,
	});
	if (isEqualMonth(_secondMonthPlaceholder, placeholder.value))
		placeholder.value = placeholder.value.subtract({ months: 1 });
});

const weekDaysCh = ["一", "二", "三", "四", "五", "六", "日"];
</script>

<template>
	<Popover>
		<PopoverTrigger as-child>
			<Button
				variant="outline"
				:class="
					cn(
						'w-[280px] justify-start text-left font-normal cursor-pointer',
						!value && 'text-muted-foreground'
					)
				"
			>
				<Calendar class="mr-2 h-4 w-4" />
				<template v-if="value.start">
					<template v-if="value.end">
						{{
							formatter.custom(toDate(value.start), {
								dateStyle: "medium",
							})
						}}
						-
						{{
							formatter.custom(toDate(value.end), {
								dateStyle: "medium",
							})
						}}
					</template>

					<template v-else>
						{{
							formatter.custom(toDate(value.start), {
								dateStyle: "medium",
							})
						}}
					</template>
				</template>
				<template v-else> 请选择日期 </template>
			</Button>
		</PopoverTrigger>
		<PopoverContent class="w-auto p-0">
			<RangeCalendarRoot
				v-slot="{ weekDays }"
				v-model="value"
				v-model:placeholder="placeholder"
				:weekStartsOn="1"
				class="p-3"
			>
				<div
					class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0"
				>
					<div class="flex flex-col gap-4">
						<div class="flex items-center justify-between">
							<button
								:class="
									cn(
										buttonVariants({ variant: 'outline' }),
										'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
									)
								"
								@click="updateMonth('first', -1)"
							>
								<ChevronLeft class="h-4 w-4" />
							</button>
							<div :class="cn('text-sm font-medium')">
								{{ formatter.fullMonthAndYear(toDate(firstMonth.value)) }}
							</div>
							<button
								:class="
									cn(
										buttonVariants({ variant: 'outline' }),
										'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
									)
								"
								@click="updateMonth('first', 1)"
							>
								<ChevronRight class="h-4 w-4" />
							</button>
						</div>
						<RangeCalendarGrid>
							<RangeCalendarGridHead>
								<RangeCalendarGridRow>
									<RangeCalendarHeadCell
										v-for="day in weekDaysCh"
										:key="day"
										class="w-full"
									>
										{{ day }}
									</RangeCalendarHeadCell>
								</RangeCalendarGridRow>
							</RangeCalendarGridHead>
							<RangeCalendarGridBody>
								<RangeCalendarGridRow
									v-for="(weekDates, index) in firstMonth.rows"
									:key="`weekDate-${index}`"
									class="mt-2 w-full"
								>
									<RangeCalendarCell
										v-for="weekDate in weekDates"
										:key="weekDate.toString()"
										:date="weekDate"
									>
										<RangeCalendarCellTrigger
											:day="weekDate"
											:month="firstMonth.value"
										/>
									</RangeCalendarCell>
								</RangeCalendarGridRow>
							</RangeCalendarGridBody>
						</RangeCalendarGrid>
					</div>
					<div class="flex flex-col gap-4">
						<div class="flex items-center justify-between">
							<button
								:class="
									cn(
										buttonVariants({ variant: 'outline' }),
										'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
									)
								"
								@click="updateMonth('second', -1)"
							>
								<ChevronLeft class="h-4 w-4" />
							</button>
							<div :class="cn('text-sm font-medium')">
								{{ formatter.fullMonthAndYear(toDate(secondMonth.value)) }}
							</div>

							<button
								:class="
									cn(
										buttonVariants({ variant: 'outline' }),
										'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
									)
								"
								@click="updateMonth('second', 1)"
							>
								<ChevronRight class="h-4 w-4" />
							</button>
						</div>
						<RangeCalendarGrid>
							<RangeCalendarGridHead>
								<RangeCalendarGridRow>
									<RangeCalendarHeadCell
										v-for="day in weekDaysCh"
										:key="day"
										class="w-full"
									>
										{{ day }}
									</RangeCalendarHeadCell>
								</RangeCalendarGridRow>
							</RangeCalendarGridHead>
							<RangeCalendarGridBody>
								<RangeCalendarGridRow
									v-for="(weekDates, index) in secondMonth.rows"
									:key="`weekDate-${index}`"
									class="mt-2 w-full"
								>
									<RangeCalendarCell
										v-for="weekDate in weekDates"
										:key="weekDate.toString()"
										:date="weekDate"
									>
										<RangeCalendarCellTrigger
											:day="weekDate"
											:month="secondMonth.value"
										/>
									</RangeCalendarCell>
								</RangeCalendarGridRow>
							</RangeCalendarGridBody>
						</RangeCalendarGrid>
					</div>
				</div>
			</RangeCalendarRoot>
		</PopoverContent>
	</Popover>
</template>
