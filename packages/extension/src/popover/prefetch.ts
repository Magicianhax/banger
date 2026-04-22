/**
 * Fetch a GIF from the CDN in the content-script isolated world (which has
 * extension host_permissions for GIPHY/Tenor) and return it as a base64 data
 * URL.
 *
 * We hand this data URL to the main-world insert function instead of the
 * original https URL. Main-world `fetch(dataUrl)` decodes it in-memory
 * synchronously — no network hop on click — which is the difference between
 * a multi-second attach and a sub-second one.
 */
export async function prefetchGifAsDataUrl(
  url: string,
): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('FileReader result was not a string'));
      };
      reader.onerror = () => reject(reader.error ?? new Error('read failed'));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
