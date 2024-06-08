import * as core from "@actions/core";

export class Provisioner {
  provision(folder: string): void {
    core.addPath(folder);
  }
}
