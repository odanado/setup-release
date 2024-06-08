import * as core from "@actions/core";

import { type Config } from "../types";

function resolveArch(): Config["arch"] {
  const arch = core.getInput("arch");
  if (arch !== "") {
    return { value: arch, strict: true };
  }

  const runnerArch = process.env.RUNNER_ARCH;

  // https://docs.github.com/en/actions/learn-github-actions/contexts#runner-context
  switch (runnerArch) {
    case "X64":
      return { value: "amd64", strict: false };
    case "ARM64":
      return { value: "arm64", strict: false };
    default:
      throw new Error(`Unsupported architecture: ${runnerArch}`);
  }
}

function resolvePlatform(): Config["platform"] {
  const platform = core.getInput("platform");
  if (platform !== "") {
    return { value: platform, strict: true };
  }

  const runnerOS = process.env.RUNNER_OS;

  // https://docs.github.com/en/actions/learn-github-actions/contexts#runner-context
  switch (runnerOS) {
    case "Linux":
      return { value: "Linux", strict: false };
    case "Windows":
      return { value: "Windows", strict: false };
    case "macOS":
      return { value: "macOS", strict: false };
    default:
      throw new Error(`Unsupported platform: ${runnerOS}`);
  }
}

function resolveArchive(): Config["archive"] {
  const archive = core.getInput("archive");
  if (archive === "tar.gz" || archive === "zip" || archive === "darwin") {
    return archive;
  }

  throw new Error(`Unsupported archive type: ${archive}`);
}

export function resolveConfig(): Config {
  const repository = core.getInput("repository", { required: true });
  const [owner, repo] = repository.split("/");
  return {
    owner,
    repo,
    installPath: core.getInput("installPath"),
    arch: resolveArch(),
    platform: resolvePlatform(),
    name: repository.replace("/", "-"),
    tag: core.getInput("tag"),
    token: core.getInput("token", { required: true }),
    archive: resolveArchive(),
  };
}
