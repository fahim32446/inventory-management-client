export const baseUrl: string = import.meta.env.VITE_API_BASE_URL;
export const socketBaseUrl: string = import.meta.env.VITE_SOCKET_URL;
export const IMAGE_HOST_URL: string = import.meta.env.VITE_IMAGE_HOST_URL;

export function getImageLink(name?: string): string {
  return IMAGE_HOST_URL + name;
}
