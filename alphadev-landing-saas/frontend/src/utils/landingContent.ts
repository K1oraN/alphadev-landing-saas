export function splitLandingContent(content?: string | null, separator = ";") {
  return (content ?? "")
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
