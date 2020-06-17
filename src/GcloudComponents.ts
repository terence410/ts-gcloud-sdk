// https://cloud.google.com/sdk/gcloud/reference/projects

import {machineTypes} from "./enums/container/machineTypes";
import {GcloudBase} from "./GcloudBase";
import {GcloudContainerClusters} from "./GcloudContainer/GcloudContainerClusters";

export class GcloudComponents extends GcloudBase {
    public commandPrefix = "components";

    public async install(name: string) {
        return await this._exec(["install", name]);
    }
}
