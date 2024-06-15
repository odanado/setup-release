# Setup Release

[![CI][ci]][ci-status]
[![GitHub Marketplace][marketplace]][marketplace-status]
[![Mergify Status][mergify-status]][mergify]

Forked from [KeisukeYamashita/setup-release](https://github.com/KeisukeYamashita/setup-release).

A GitHub Action that downloads a release and provision for later job usage.
You don't need to download assets and extract, add system pathes, this action will do it for you with very easy configurations.

## Usage

```yml
- name: Get conftest CLI
  uses: odanado/setup-release@v0
  with:
    repository: open-policy-agent/conftest
```

### Dowload and provision tagged and latest release

This is just an example to show one way in which this action can be used.

```yml
on: pull_request
jobs:
  provision-tagged-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: odanado/setup-release@v0
        with:
          repository: spinnaker/kleat
          tag: v0.3.0
      # Use the "kleat" command in the later steps
  provision-latest-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: odanado/setup-release@v0
        with:
          repository: spinnaker/kleat
      # Use the "kleat" command in the later steps
```

### Action inputs

| Name          | Description                                                                                                                           | Default        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `arch`        | The asset arch target. This value is case-insensitive.                                                                                | `runner.arch`  |
| `archive`     | Archive type. Currently, `tar.gz`, `darwin` and `zip` is supported.                                                                   | `tar.gz`       |
| `installPath` | Path to install the extracted asset                                                                                                   | UUID           |
| `repository`  | The GitHub repository where it is released                                                                                            | `true`         |
| `platform`    | Assets target platform. `linux`, `darwin` is supported. This value is case-insensitive.                                               | `runner.os`    |
| `tag`         | GitHub tag of the release                                                                                                             | `latest`       |
| `token`       | `GITHUB_TOKEN` or a `repo` scoped [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). | `GITHUB_TOKEN` |

_Note: You cannot use this action if the asset name is not included in the asset name because the search is based on the three inputs(`arch`, `archive` and `platform`) in the asset.name field._

#### Install Path

The extracted assets will be stores in `/tmp/${UUID}` by default. It is recommented to use this if you have multiple stages that uses this action.
But, if you want to configure it, you can use `installPath`.

### Action outputs

| Name                 | Description                               |
| -------------------- | ----------------------------------------- |
| `asset-id`           | ID of the downloaded, provisioned asset   |
| `asset-name`         | Name of the downloaded, provisioned asset |
| `restore-from-cache` | If restored from cache or not             |
| `tag`                | Tag that downloaded                       |

### Accessing issues in other repositories

You can close issues in another repository by using a [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) instead of `GITHUB_TOKEN`.
The user associated with the PAT must have write access to the repository.

## License

[MIT](LICENSE)
