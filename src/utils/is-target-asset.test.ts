import { describe, it, expect } from "vitest";

import { isTargetAsset } from "./is-target-asset";

describe("isTargetAsset", () => {
  const name = "tool-name_linux_amd64.tar.gz";
  describe("strict mode", () => {
    it("should return true if the name matches the arch and platform", () => {
      expect(
        isTargetAsset({
          name,
          arch: { value: "amd64", strict: true },
          platform: { value: "Linux", strict: true },
        }),
      ).toBe(true);
    });

    it("should return false if the name does not match the arch", () => {
      expect(
        isTargetAsset({
          name,
          arch: { value: "arm64", strict: true },
          platform: { value: "Linux", strict: true },
        }),
      ).toBe(false);
    });
  });

  describe("non-strict mode", () => {
    it("should return true if the name matches the arch and platform", () => {
      expect(
        isTargetAsset({
          name: "tool-name_linux_x86_64.tar.gz",
          arch: { value: "amd64", strict: false },
          platform: { value: "Linux", strict: false },
        }),
      ).toBe(true);
    });

    it("should return true when os is darwin", () => {
      expect(
        isTargetAsset({
          name: "tool-name_Darwin_arm64.tar.gz",
          arch: { value: "arm64", strict: false },
          platform: { value: "macOS", strict: false },
        }),
      ).toBe(true);

      expect(
        isTargetAsset({
          name: "tool-name_macos_arm64.tar.gz",
          arch: { value: "arm64", strict: false },
          platform: { value: "macOS", strict: false },
        }),
      ).toBe(true);
    });
  });
});
