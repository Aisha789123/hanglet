// A live clock that counts down to midnight, when the next Daily starts.

function timeLeft() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const seconds = Math.max(0, Math.floor((midnight - now) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return [hours, minutes, rest].map((part) => String(part).padStart(2, "0")).join(":");
}

// Updates the element every second. At midnight it calls onNewDay once.
export function startCountdown(element, onNewDay = null) {
  const startDay = new Date().getDate();
  element.textContent = timeLeft();
  element.setAttribute("role", "timer");
  const timer = setInterval(() => {
    if (new Date().getDate() !== startDay) {
      clearInterval(timer);
      if (onNewDay) onNewDay();
      return;
    }
    element.textContent = timeLeft();
  }, 1000);
  return () => clearInterval(timer);
}
