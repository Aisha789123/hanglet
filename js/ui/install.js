// "Install app" button. Browsers that support it fire "beforeinstallprompt".

let installEvent = null;
const buttons = [];

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installEvent = event;
  buttons.forEach((button) => (button.hidden = false));
});

window.addEventListener("appinstalled", () => {
  installEvent = null;
  buttons.forEach((button) => (button.hidden = true));
});

export function setupInstallButton(button) {
  if (!button) return;
  buttons.push(button);
  button.hidden = !installEvent;
  button.addEventListener("click", async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    installEvent = null;
    button.hidden = true;
  });
}
