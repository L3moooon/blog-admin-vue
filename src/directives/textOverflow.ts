import { nextTick } from "vue";
declare global {
  interface HTMLElement {
    _overflowObserver?: ResizeObserver;
  }
}
export default {
  mounted(el: HTMLElement, binding: any) {
    const checkOverflow = () => {
      const isOverflowing = el.scrollWidth > el.clientWidth;
      binding.value(isOverflowing);
    };
    // 初始检查
    nextTick(() => {
      checkOverflow();
    });

    // 监听窗口变化
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    // 保存观察器以便卸载时使用
    el._overflowObserver = resizeObserver;
  },
  unmounted(el: HTMLElement) {
    if (el._overflowObserver) {
      el._overflowObserver.disconnect();
    }
  },
};
