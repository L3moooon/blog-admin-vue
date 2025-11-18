<script setup lang="ts">
import ScrollNumber from "./scrollNumber.vue";
import { onMounted, ref } from "vue";
import { getNumData as getNumDataApi } from "@/api/overview/analysis";

const numData = ref({
	total_visits: 0,
	article_count: 0,
	comment_count: 0,
	star_count: 0,
});
//获取分析页数据
const getNumData = async () => {
	const { data, code } = await getNumDataApi();
	if (code == 1) {
		numData.value = data;
	}
};
onMounted(() => {
	getNumData();
});
</script>
<template>
	<ScrollNumber
		title="总访问量"
		:target="numData.total_visits"
		:total="2000"
		subText="今日访问量"
		:subNumber="2"
	>
		<template #icon>
			<img
				class="size-12"
				src="@/assets/icons/global.png"
				alt=""
			/>
		</template>
	</ScrollNumber>
	<ScrollNumber
		title="总文章量"
		:target="numData.article_count"
		subText="今日发布文章"
		:subNumber="1"
	>
		<template #icon>
			<img
				class="size-12"
				src="@/assets/icons/filetext.png"
				alt=""
			/>
		</template>
	</ScrollNumber>
	<ScrollNumber
		title="总评论量"
		:target="numData.comment_count"
		subText="今日收获评论"
		:subNumber="2"
	>
		<template #icon>
			<img
				class="size-12"
				src="@/assets/icons/comment.png"
				alt=""
			/>
		</template>
	</ScrollNumber>
	<ScrollNumber
		title="总点赞量"
		:target="numData.star_count"
		subText="今日收获点赞"
		:subNumber="2"
	>
		<template #icon>
			<img
				class="size-12"
				src="@/assets/icons/click.png"
				alt=""
			/>
		</template>
	</ScrollNumber>
</template>
