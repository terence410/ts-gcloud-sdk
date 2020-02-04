// https://cloud.google.com/sdk/gcloud/reference/run/

import {memory} from "./enums/run/memory";
import {GcloudBase} from "./GcloudBase";
import {GcloudRunDomainMappings} from "./GCloudRun/GcloudRunDomainMappings";
import {GcloudRunRevisions} from "./GCloudRun/GcloudRunRevisions";
import {GcloudRunServices} from "./GCloudRun/GcloudRunServices";
import {IStandardListArgv} from "./types";

// argv

export type IManagedArgv = {
    platform: "managed";
    region?: string;
};

export type IGkeArgv = {
    platform: "gke";
    namespace: string,
    cluster: string,
    clusterLocation: string,
    context?: string,
    kubeconfig?: string,
};

type IDeployArgv = {
    region?: string,
    image: string,
    platform: "managed" | "gke" | "kubernetes",
    namespace?: "default" | "kube-system" | "kube-public" | "gke-system" | "knative-serving",
    args?: string | string [],
    async?: boolean,
    command?: string,
    concurrency?: number,
    maxInstances?: number,
    memory?: string,
    port?: number,
    timeout?: string,
    clearEnvVars?: boolean,
    setEnvVars?: string | object,
    removeEnvVars?: string | object,
    updateEnvVars?: string | object,
    clearLabels?: boolean,
    removeLabels?: string[] | string,
    labels?: string | object,
    updateLabels?: string | object,
    connectivity?: "external" | "internal",
    cpu?: string,
    allowUnauthenticated?: boolean,
    noAllowUnauthenticated?: boolean,
    revisionSuffix?: string,
    serviceAccount?: string,
    addCloudsqlInstances?: string,
    clearCloudsqlInstances?: boolean,
    removeCloudsqlInstances?: string[] | string,
    setCloudsqlInstances?: string[] | string,
    cluster?: string,
    clusterLocation?: string,
    context?: string,
    kubeconfig?: string,
};

export class GcloudRun extends GcloudBase {
    public commandPrefix: string = "run";
    public memory = memory;

    public async deploy(serviceName: string, argv: IDeployArgv) {
        return await this._exec(["deploy", serviceName], argv);
    }

    public domainMappings() {
        return this.extend(GcloudRunDomainMappings);
    }

    public revisions() {
        return this.extend(GcloudRunRevisions);
    }

    public services() {
        return this.extend(GcloudRunServices);
    }
}
