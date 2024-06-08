export type ArchiveType = "tar.gz" | "zip" | "darwin";

export interface Config {
  installPath: string;
  owner: string;
  repo: string;
  token: string;
  tag: string;
  platform:
    | {
        value: string;
        strict: true;
      }
    | { value: "Linux" | "Windows" | "macOS"; strict: false };
  arch:
    | {
        value: string;
        strict: true;
      }
    | { value: "amd64" | "arm64"; strict: false };
  name: string;
  archive: ArchiveType;
}
