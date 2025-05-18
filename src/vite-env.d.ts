/// <reference types="vite/client" />

declare module 'path' {
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
}

declare module 'url' {
  export function fileURLToPath(url: string): string;
}

interface ImportMeta {
  url: string;
}
