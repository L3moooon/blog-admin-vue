export default {
  //加载动画
  mounted(el, binding) {
    const spinner = document.createElement("div");
    spinner.className = "loading-spinner";
    const style = document.createElement("style");
    style.textContent = `
      .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-left-color: #22a6b3;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    el.style.position = "relative";
    el.appendChild(spinner);
    if (binding.value) {
      spinner.style.display = "block";
    } else {
      spinner.style.display = "none";
    }
  },
};
