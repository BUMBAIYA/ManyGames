export function verifyImageUrl(
  url: string,
  defaultUrl: string
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(defaultUrl);
    img.src = url;
  });
}
