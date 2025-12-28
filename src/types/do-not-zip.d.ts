declare module 'do-not-zip' {
  interface FileInput {
    path: string;
    data: string | Uint8Array;
  }

  export function toArray(files: FileInput[]): number[];
  export function toBlob(files: FileInput[]): Blob;
  export function toBuffer(files: FileInput[]): Buffer;
  export function toAuto(files: FileInput[]): Buffer | Blob;
}
