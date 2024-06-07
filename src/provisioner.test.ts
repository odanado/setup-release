import { describe, it, expect, vi } from "vitest";
import * as core from "@actions/core";

import { Provisioner } from "./provisioner";

vi.mock("@actions/core");

describe("provisioner", () => {
  it("provisions a folder", () => {
    const provisioner = new Provisioner({});

    const folder = "folder";
    provisioner.provision(folder);

    expect(core.addPath).toHaveBeenCalledWith(folder);
  });
});
