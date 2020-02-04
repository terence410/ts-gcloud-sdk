// https://cloud.google.com/sdk/gcloud/reference/run/services

import {GcloudBase} from "../GcloudBase";
import {IRunArgv} from "../GcloudRun";
import {IStandardListArgv} from "../types";

type IListResult = {
    service: string,
    region: string,
    url: string,
    lastDeployedBy: string,
    lastDeployedAt: string,
};

// argv

type IListArgv = IRunArgv & IStandardListArgv & {
    cluster?: string,
    clusterLocation?: string,
    context?: string,
    kubeconfig?: string,
};

export class GcloudRunServices extends GcloudBase {
    public commandPrefix: string = "run services";

    public async list(argv: IListArgv) {
        const table = await this._exec(["list"], argv);
        const headers = ["service", "region", "url", "lastDeployedBy", "lastDeployedAt"];
        return this._parseTable(table, headers,
            {capitalizeWithoutUnderscore: true}) as IListResult[];
    }

    public async describe(serviceName: string, argv: IRunArgv) {
        return await this._exec(["describe", serviceName], argv);
    }

    public async delete(serviceName: string, argv: IRunArgv) {
        return await this._exec(["delete", serviceName], argv);
    }
}
