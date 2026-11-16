// Small messages at the bottom of the screen, also read out by screen readers.

let container = null;

export function showToast(message, iconHtml = "") {
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-area";
    container.setAttribute("role", "status");
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `${iconHtml}<span></span>`;
  toast.querySelector("span").textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add("is-leaving"), 2600);
  setTimeout(() => toast.remove(), 3000);
}

// Copy text to the clipboard, with a fallback for older browsers
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  }
}
