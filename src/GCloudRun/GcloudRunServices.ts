// https://cloud.google.com/sdk/gcloud/reference/run/services

import {GcloudBase} from "../GcloudBase";
import {IGkeArgv, IManagedArgv} from "../GcloudRun";
import {IStandardListArgv} from "../types";

type IManagedListResult = {
    service: string,
    region: string,
    url: string,
    lastDeployedBy: string,
    lastDeployedAt: string,
};

type IGkeListResult = {
    service: string,
    namespace: string,
    url: string,
    lastDeployedBy: string,
    lastDeployedAt: string,
};

// argv

type IManagedListArgv = IManagedArgv & IStandardListArgv;
type IGkeListArgv = IGkeArgv & IStandardListArgv;

export class GcloudRunServices extends GcloudBase {
    public commandPrefix: string = "run services";

    public async listManaged(argv: IManagedListArgv) {
        const table = await this._exec(["list"], argv);
        const headers = ["service", "region", "url", "lastDeployedBy", "lastDeployedAt"];
        return this._parseTable(table, headers) as IManagedListResult[];
    }

    public async listGke(argv: IGkeListArgv) {
        const table = await this._exec(["list"], argv);
        const headers = ["service", "namespace", "url", "lastDeployedBy", "lastDeployedAt"];
        return this._parseTable(table, headers) as IGkeListResult[];
    }

    public async describeManaged(serviceName: string, argv: IManagedArgv) {
        return await this._exec(["describe", serviceName], argv);
    }

    public async describeGke(serviceName: string, argv: IGkeArgv) {
        return await this._exec(["describe", serviceName], argv);
    }

    public async deleteManaged(serviceName: string, argv: IManagedArgv) {
        return await this._exec(["delete", serviceName], argv);
    }

    public async deleteGke(serviceName: string, argv: IGkeArgv) {
        return await this._exec(["delete", serviceName], argv);
    }
}
