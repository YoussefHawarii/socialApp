/**
 * Appends a Cloudinary delivery transformation to a `secure_url` so the CDN serves an
 * already-downsized image instead of the full original — avoids downloading a multi-MB
 * upload just to shrink it with CSS. No-op on non-Cloudinary URLs.
 */
export function withCloudinaryLimit(url: string, width: number): string {
  const uploadMarker = '/upload/';
  const index = url.indexOf(uploadMarker);
  if (index === -1) return url;

  const insertAt = index + uploadMarker.length;
  const transform = `w_${width},c_limit,q_auto,f_auto/`;
  return url.slice(0, insertAt) + transform + url.slice(insertAt);
}
