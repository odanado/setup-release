import * as github from "@actions/github";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { ReposGetLatestReleaseResponseData } from "@octokit/types";
import { inspect } from "util";

import { Config } from "./types";
import { isTargetAsset } from "./utils/is-target-asset";

export class Downloader {
  private latest: boolean;
  constructor(private cfg: Config) {
    this.latest = cfg.tag === "latest";
  }

  get #cacheKey(): string {
    return `${this.cfg.owner}-${this.cfg.repo}`;
  }

  async download(): Promise<string> {
    const client = github.getOctokit(this.cfg.token);

    let release: ReposGetLatestReleaseResponseData;
    if (this.latest) {
      const resp = await client.repos.getLatestRelease({
        owner: this.cfg.owner,
        repo: this.cfg.repo,
      });
      release = resp.data;
      this.cfg.tag = release.tag_name;
    } else {
      const resp = await client.repos.getReleaseByTag({
        owner: this.cfg.owner,
        repo: this.cfg.repo,
        tag: this.cfg.tag,
      });
      release = resp.data;
    }

    core.setOutput("tag", this.cfg.tag);

    // check cache
    const toolPath = tc.find(this.#cacheKey, this.cfg.tag);
    if (toolPath) {
      core.info(`Found in cache @ ${toolPath} for tag ${this.cfg.tag}`);
      core.setOutput("restore-from-cache", true);
      return toolPath;
    }

    core.setOutput("restore-from-cache", false);

    const asset = release.assets.find((a) =>
      isTargetAsset({
        name: a.name,
        arch: this.cfg.arch,
        platform: this.cfg.platform,
      }),
    );
    if (!asset) {
      core.debug(`Cound not find asset ${inspect(this.cfg)}`);
      core.debug(`Asset count:${release.assets}, release:${inspect(release)}`);
      core.setOutput("matched", false);
      throw new Error("Cound not find asset");
    }

    core.setOutput("asset-id", asset.id);
    core.setOutput("asset-name", asset.name);

    const dest = await tc.downloadTool(
      asset.browser_download_url,
      this.cfg.installPath ? this.cfg.installPath : undefined,
      this.cfg.token,
    );

    core.debug(`Download asset: ${asset.name}`);

    let assetExtractedFolder: string;
    switch (this.cfg.archive) {
      case "tar.gz":
        assetExtractedFolder = await tc.extractTar(dest);
        break;
      case "darwin":
        assetExtractedFolder = await tc.extractXar(dest);
        break;
      case "zip":
        assetExtractedFolder = await tc.extractZip(dest);
        break;
    }

    core.debug(`Cached @ ${assetExtractedFolder} for tag ${this.cfg.tag}`);
    return await tc.cacheDir(
      assetExtractedFolder,
      this.#cacheKey,
      this.cfg.tag,
    );
  }
}
