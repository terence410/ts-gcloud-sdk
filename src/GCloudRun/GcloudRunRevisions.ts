// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "../GcloudBase";
import {IGkeArgv, IManagedArgv} from "../GcloudRun";
import {IStandardListArgv} from "../types";

type IListResult = {
    revision: string,
    active: string,
    service: string,
    deployed: string,
    deployedBy: string,
};

// argv

type IManagedListArgv = IManagedArgv & {service?: string} & IStandardListArgv;
type IGkeListArgv = IGkeArgv & {service?: string} & IStandardListArgv;

export class GcloudRunRevisions extends GcloudBase {
    public commandPrefix: string = "run revisions";

    public async listManaged(argv: IManagedListArgv ) {
        const table = await this._exec(["list"], argv);
        const headers = ["revision", "active", "service", "deployed", "deployedBy"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async listGke(argv: IGkeListArgv ) {
        const table = await this._exec(["list"], argv);
        const headers = ["revision", "active", "service", "deployed", "deployedBy"];
        return this._parseTable(table, headers) as IListResult[];
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
