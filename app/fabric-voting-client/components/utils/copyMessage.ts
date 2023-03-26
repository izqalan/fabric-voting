export default function copyMessage(message: string) {
  const el = document.createElement('textarea');
  el.value = message;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
