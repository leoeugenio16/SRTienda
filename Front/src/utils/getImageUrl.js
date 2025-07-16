export function getImageUrl(img) {
  if (!img) return "/placeholder.jpg";

  // Si ya es string (guardada en localStorage), devolvemos directamente
  if (typeof img === "string") return img;

  // Usamos el formato de mejor calidad disponible
  const preferredFormat =
    img.formats?.large?.url ||
    img.formats?.medium?.url ||
    img.formats?.small?.url ||
    img.url;

  if (!preferredFormat) return "/placeholder.jpg";

  // Si ya es una URL absoluta (Cloudinary u otra CDN)
  if (preferredFormat.startsWith("http")) {
    return preferredFormat;
  }

  // Si es una ruta relativa en Strapi
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";
  return `${baseUrl}${preferredFormat}`;
}
