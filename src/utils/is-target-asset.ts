import { Config } from "../types";

function matchArch({
  name,
  arch,
}: {
  name: string;
  arch: Config["arch"];
}): boolean {
  if (arch.strict) {
    return name.toLowerCase().includes(arch.value.toLowerCase());
  }

  switch (arch.value) {
    case "amd64":
      return /amd64|x64|x86_64/i.test(name);
    case "arm64":
      return /arm64/i.test(name);
  }
}

function matchPlatform({
  name,
  platform,
}: {
  name: string;
  platform: Config["platform"];
}): boolean {
  if (platform.strict) {
    return name.toLowerCase().includes(platform.value.toLowerCase());
  }

  switch (platform.value) {
    case "Linux":
      return /linux/i.test(name);
    case "Windows":
      return /windows/i.test(name);
    case "macOS":
      return /macos|darwin/i.test(name);
  }
}

export function isTargetAsset({
  name,
  arch,
  platform,
}: {
  name: string;
  arch: Config["arch"];
  platform: Config["platform"];
}): boolean {
  return matchArch({ name, arch }) && matchPlatform({ name, platform });
}
