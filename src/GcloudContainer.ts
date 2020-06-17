// https://cloud.google.com/sdk/gcloud/reference/container/

import {machineTypes} from "./enums/container/machineTypes";
import {GcloudBase} from "./GcloudBase";
import {GcloudContainerClusters} from "./GcloudContainer/GcloudContainerClusters";

export class GcloudContainer extends GcloudBase {
    public commandPrefix = "container";
    public machineTypes  = machineTypes;

    public clusters() {
        return this.extend(GcloudContainerClusters);
    }
}
