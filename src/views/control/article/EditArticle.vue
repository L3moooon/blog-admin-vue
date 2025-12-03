<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, BookPlus, Tag, Upload } from "lucide-vue-next";
import { toast } from "vue-sonner";

import { ref, onMounted, onUnmounted, shallowRef, watch, reactive } from "vue";
import { addArticle, updateArticle } from "@/api/control/article";
import { upload } from "@/api/public/index";
import { cloneDeep } from "lodash";
import type {
	ArticleItem,
	AddArticleRequest,
	UpgradeArticleRequest,
	TagListResponse,
	TagItem,
} from "@/api/control/article/type";

import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import {
	type IDomEditor,
	type IToolbarConfig,
	IEditorConfig,
} from "@wangeditor/editor";
import "@wangeditor/editor/dist/css/style.css";

const showArticleDialog = defineModel<boolean>();
const props = withDefaults(
	defineProps<{
		tagList: Array<TagItem>;
		rowInfo: ArticleItem | null;
	}>(),
	{}
);
const emits = defineEmits(["update:article"]);
interface ArticleForm {
	id: number | undefined;
	title: string;
	cover_img: string;
	abstract: string;
	content: string;
	tag: Array<number>;
}
const initialForm = {
	id: undefined,
	title: "",
	cover_img: "",
	abstract: "",
	content: "",
	tag: [],
};
const form = reactive<ArticleForm>(initialForm);
// 编辑器实例
const editorRef = shallowRef();
//工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
	excludeKeys: ["fullScreen"], //排除全屏按钮
};
//编辑器配置
const editorConfig: Partial<IEditorConfig> = {
	placeholder: "请输入内容...",
	MENU_CONF: {
		uploadImage: {
			async customUpload(file: File, insertFn: Function) {
				try {
					const formData = new FormData();
					formData.append("file", file);
					// 调用上传接口
					const { data, status } = await upload(formData);
					if (status === 1) {
						// 插入图片到编辑器
						// insertFn(图片src, 图片alt, 图片title)
						insertFn(data.url, file.name, file.name);
						toast.success("图片上传成功");
					} else {
						toast.error("图片上传失败: " + (data.msg || "未知错误"));
					}
				} catch (error) {
					console.error("图片上传错误:", error);
					toast.error("图片上传失败，请重试");
				}
			},
			// 允许的图片类型
			allowedFileTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
			maxFileSize: 2 * 1024 * 1024,
			uploadText: "上传图片",
		},
	},
};
const handleCreated = (editor: IDomEditor) => {
	editorRef.value = editor;
};
//修改标签
const handleTagsChange = (tagId: number) => {
	const checked = form.tag.includes(tagId);
	console.log(checked, tagId);
	if (!checked) {
		form.tag.push(tagId);
	} else {
		const index = form.tag.indexOf(tagId);
		if (index > -1) {
			form.tag.splice(index, 1);
		}
	}
	console.log(form.tag);
};

// 处理封面上传
const handleUploadCover = () => {
	const fileInput = document.getElementById("article-cover-upload");
	if (fileInput) {
		fileInput.click();
	}
};
const handleImageUpload = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files ? target.files[0] : null;
	if (file) {
		const formData = new FormData();
		formData.append("file", file);
		const { data, status } = await upload(formData);
		if (status == 1) {
			console.log(data);
			form.cover_img = data.url;
		}
	}
};

//提交
const handleSubmit = async () => {
	// 根据是否有rowInfo判断调用新增还是编辑接口
	const { code } = await (props.rowInfo
		? updateArticle(form)
		: addArticle(form));
	if (code === 1) {
		toast.success("提交成功");
		showArticleDialog.value = false;
	} else {
		toast.error("提交失败");
	}
	emits("update:article");
};

watch(
	() => showArticleDialog.value,
	(val) => {
		if (val) {
			console.log("打开弹窗", props.rowInfo, form);
			if (props.rowInfo) {
				form.id = props.rowInfo.id;
				form.title = props.rowInfo.title;
				form.cover_img = props.rowInfo.cover_img;
				form.abstract = props.rowInfo.abstract;
				form.content = props.rowInfo.content;
				form.tag = props.rowInfo.tag;
			}
		} else {
			//退出提示保存草稿
			resetForm();
			console.log("关闭弹窗", form);
		}
	}
);
const resetForm = () => {
	form.id = undefined;
	form.title = "";
	form.cover_img = "";
	form.abstract = "";
	form.content = "";
	form.tag = [];
};
onUnmounted(() => {
	if (editorRef.value == null) return;
	editorRef.value.destroy();
	editorRef.value = null;
});
</script>

<template>
	<Dialog
		v-model:open="showArticleDialog"
		:modal="false">
		<!-- 固定为全屏dialog -->
		<DialogContent
			class="w-full h-full max-w-full sm:max-w-full p-0 fixed top-0 left-0 translate-0 rounded-none block">
			<!-- 固定顶部和工具栏 -->
			<DialogHeader
				class="w-full mx-auto pt-4 h-fit fixed top-0 left-0 z-50 bg-white">
				<Button
					variant="outline"
					class="absolute top-2 left-5 cursor-pointer"
					@click="showArticleDialog = false">
					<ChevronLeft />
					返回
				</Button>
				<div class="text-xl font-medium text-center">
					<span v-if="form.id"> 编辑文章 </span>
					<span v-else>发布文章</span>
				</div>
				<Separator />
				<Toolbar
					class="w-full flex justify-center"
					:editor="editorRef"
					:defaultConfig="toolbarConfig"
					mode="default" />
				<Separator />
			</DialogHeader>
			<!-- 编辑器内容区域 -->
			<ScrollArea class="h-[calc(100vh-6.9rem)] w-full mt-27 mb-5">
				<div class="w-full bg-gray-100 shadow-gray-100 table">
					<!-- 文章内容 -->
					<div
						class="w-1/2 min-h-[calc(100vh-14.5rem)] mx-auto my-5 px-15 py-10 box-content border bg-white shadow-lg shadow-gray-300">
						<Input
							v-model="form.title"
							type="text"
							class="selection:none border-0 focus:ring-0 focus:outline-none shadow-none focus-visible:ring-0 !text-2xl"
							placeholder="请输入标题..." />
						<Separator class="my-5" />
						<Editor
							v-model="form.content"
							:defaultConfig="editorConfig"
							mode="default"
							@onCreated="handleCreated" />
					</div>
					<!-- 文章设置 -->
					<div
						class="w-1/2 mx-auto mt-5 mb-25 px-15 py-10 box-content border bg-white shadow-lg shadow-gray-300 flex flex-col gap-2">
						<Label>简介</Label>
						<Textarea
							v-model="form.abstract"
							placeholder="请输入文章简介..." />
						<Label>标签</Label>
						<div class="flex gap-4 flex-wrap">
							<div
								class="flex"
								v-for="item in tagList">
								<Checkbox
									class="cursor-pointer mr-2"
									:model-value="form.tag.includes(item.id)"
									@update:model-value="handleTagsChange(item.id)" />
								<label
									for="terms2"
									class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									{{ item.tag_name }}
								</label>
							</div>
						</div>
						<Label>封面</Label>
						<!-- 图片上传组件 -->
						<div class="flex gap-2">
							<input
								id="article-cover-upload"
								class="hidden"
								type="file"
								accept="image/*"
								@change="handleImageUpload" />
							<!-- 显示已上传的图片预览 -->
							<div
								v-if="form.cover_img"
								class="size-32 border rounded-sm overflow-hidden">
								<img
									:src="form.cover_img"
									fit="cover"
									class="h-full w-full cursor-pointer"
									alt="封面预览" />
							</div>
							<div class="size-32 border rounded-sm overflow-hidden">
								<div
									class="h-full flex flex-col items-center justify-center cursor-pointer text-gray-400 text-sm"
									@click="handleUploadCover">
									<Upload />
									<span v-if="form.cover_img">重新上传封面</span>
									<span v-else>上传封面</span>
								</div>
							</div>
						</div>
						<div class="w-full flex justify-end gap-2">
							<Button
								variant="outline"
								class="cursor-pointer">
								保存草稿
							</Button>
							<Button
								class="cursor-pointer bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
								@click="handleSubmit">
								发布
							</Button>
						</div>
					</div>
				</div>
			</ScrollArea>
		</DialogContent>
	</Dialog>
</template>
