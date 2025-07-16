export function getImageUrl(img) {
  if (!img) return "/placeholder.jpg";

  // Si ya es string (guardada en localStorage), devolvemos directamente
  if (typeof img === "string") return img;

  // Si es Cloudinary (URL completa)
  if (img.url?.startsWith("http")) {
    return img.formats?.thumbnail?.url || img.url;
  }

  // Si es local (almacenado en Strapi)
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";
  return `${baseUrl}${img.formats?.thumbnail?.url || img.url}`;
}
