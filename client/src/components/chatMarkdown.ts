/** Minimal safe markdown for chatbot messages: escape HTML, then support
 *  **bold**, bullet lists, short headings, and safe links (http/https URLs
 *  and internal /medicines/... library paths). No external dependency. */
export function renderChatHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Linkify after escaping so user text can never inject attributes.
  const linked = escaped
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/(^|[\s(])(\/medicines\/[a-z0-9-]+)/g, '$1<a href="$2">$2</a>');

  const withBold = linked.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const lines = withBold.split("\n");
  let html = "";
  let inList = false;

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line === "") {
      closeList();
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${bullet[1]}</li>`;
      continue;
    }
    closeList();
    const heading = line.match(/^#{1,3}\s+(.*)$/);
    if (heading) {
      html += `<p><strong>${heading[1]}</strong></p>`;
      continue;
    }
    html += `<p>${line}</p>`;
  }
  closeList();
  return html;
}
