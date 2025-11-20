//按钮级别权限控制
import { toast } from "vue-sonner";
import { useUserStore } from "@/store/user";
import type { DirectiveBinding } from "vue";

// 全局事件委托处理函数（仅绑定一次）
function handlePermissionClick(e: MouseEvent) {
	e.stopPropagation(); // 阻止事件冒泡
	toast.warning("暂无权限");
}
export default {
	mounted(el: HTMLElement, binding: DirectiveBinding<string[]>) {
		const { value } = binding;
		const btnPermissions = useUserStore().user?.permission?.buttonKeys || [];
		if (value && value instanceof Array && value.length > 0) {
			const hasPermission = btnPermissions.some((permission) =>
				value.includes(permission)
			);
			if (!hasPermission) {
				// el.parentNode && el.parentNode.removeChild(el);
				el.style.opacity = "0.6";
				el.style.cursor = "not-allowed";
				// 将函数挂载到el上，方便卸载时移除
				el._permissionClickHandler = handlePermissionClick;
				// 绑定事件（注意：要在元素自身事件之前执行，需用capture捕获阶段）
				el.addEventListener("click", handlePermissionClick, true);
			}
		} else {
			throw new Error(`需要指定权限标签,如 v-permission="['admin']"`);
		}
	},
	unmounted(el: HTMLElement) {
		if (el._permissionClickHandler) {
			el.removeEventListener("click", el._permissionClickHandler, true);
			delete el._permissionClickHandler;
		}
	},
};
// 扩展HTMLElement类型
declare global {
	interface HTMLElement {
		_permissionClickHandler?: (e: MouseEvent) => void;
	}
}
