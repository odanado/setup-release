import * as core from "@actions/core";

export interface Config {}

export class Provisioner {
  constructor(private _: Config) {}

  provision(folder: string): void {
    core.addPath(folder);
  }
}
