export default {
  mounted(el, binding) {
    const { value } = binding;
    const userPermissions = JSON.parse(sessionStorage.getItem('userInfo')).permissions;
    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = userPermissions.some(permission => value.includes(permission));
      if (!hasPermission) {
        // el.parentNode && el.parentNode.removeChild(el);
        el.disabled = true;
        el.style.opacity = '0.6';
        el.style.cursor = 'not-allowed';
      }
    } else {
      throw new Error(`需要指定权限标签,如 v-permission="['admin']"`);
    }
  }
}