import { Downloader } from "./downloader";
import { Provisioner } from "./provisioner";

export class Agent {
  constructor(
    private downloader: Downloader,
    private provisioner: Provisioner,
  ) {}

  async run(): Promise<void> {
    const folder = await this.downloader.download();
    this.provisioner.provision(folder);
  }
}
