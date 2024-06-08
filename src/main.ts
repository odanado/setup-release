import * as core from "@actions/core";
import { Agent } from "./agent";
import { Downloader } from "./downloader";
import { Provisioner } from "./provisioner";
import { resolveConfig } from "./utils/resolve-config";

async function run(): Promise<void> {
  try {
    const config = resolveConfig();

    const downloader = new Downloader(config);
    const provisioner = new Provisioner();
    const agent = new Agent(downloader, provisioner);
    await agent.run();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    core.setFailed(err.message);
    core.debug(err.stack);
  }
}

run();
