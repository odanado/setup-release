import { describe, it, expect, vi, beforeEach } from "vitest";

import * as core from "@actions/core";

import { resolveConfig } from "./resolve-config";
import { Config } from "../types";

vi.mock("@actions/core", () => {
  return {
    getInput: vi.fn().mockReturnValue("mocked-input"),
  };
});

function createMockFn(config?: Partial<{ [key in keyof Config]: string }>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fn: typeof core.getInput = (name, _) => {
    if (config) {
      const value = config[name as keyof Config];
      if (value !== undefined) {
        return value;
      }
    }
    if (name === "repository") {
      return "odanado/setup-release";
    }
    if (name === "archive") {
      return "tar.gz";
    }

    return "mocked-input";
  };

  return fn;
}

describe("resolveConfig", () => {
  beforeEach(() => {
    vi.mocked(core.getInput).mockImplementation(createMockFn());

    vi.stubEnv("RUNNER_ARCH", "X64");
    vi.stubEnv("RUNNER_OS", "Linux");
  });
  it("should resolve config", () => {
    const config = resolveConfig();

    expect(config).toEqual({
      owner: "odanado",
      repo: "setup-release",
      installPath: "mocked-input",
      arch: { value: "mocked-input", strict: true },
      platform: { value: "mocked-input", strict: true },
      name: "odanado-setup-release",
      tag: "mocked-input",
      token: "mocked-input",
      archive: "tar.gz",
    });
  });

  it("should resolve arch from env", () => {
    vi.mocked(core.getInput).mockImplementation(createMockFn({ arch: "" }));
    expect(resolveConfig().arch).toEqual({ value: "amd64", strict: false });
  });

  it("should resolve platform from env", () => {
    vi.mocked(core.getInput).mockImplementation(createMockFn({ platform: "" }));
    expect(resolveConfig().platform).toEqual({ value: "Linux", strict: false });
  });

  it("should throw error when unsupported arch", () => {
    vi.stubEnv("RUNNER_ARCH", "unsupported");
    vi.mocked(core.getInput).mockImplementation(createMockFn({ arch: "" }));
    expect(() => resolveConfig()).toThrowError(
      "Unsupported architecture: unsupported",
    );
  });

  it("should throw error when unsupported platform", () => {
    vi.stubEnv("RUNNER_OS", "unsupported");
    vi.mocked(core.getInput).mockImplementation(createMockFn({ platform: "" }));
    expect(() => resolveConfig()).toThrowError(
      "Unsupported platform: unsupported",
    );
  });
});
