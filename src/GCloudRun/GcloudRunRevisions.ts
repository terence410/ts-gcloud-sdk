// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "../GcloudBase";
import {IRunArgv} from "../GcloudRun";
import {IStandardListArgv} from "../types";

type IListResult = {
    revision: string,
    active: string,
    service: string,
    deployed: string,
    deployedBy: string,
};

// argv

type IListArgv = IRunArgv & IStandardListArgv;

export class GcloudRunRevisions extends GcloudBase {
    public commandPrefix: string = "run revisions";

    public async list(argv: IListArgv) {
        const table = await this._exec(["list"], argv);
        const headers = ["revision", "active", "service", "deployed", "deployedBy"];
        return this._parseTable(table, headers,
            {capitalizeWithoutUnderscore: true, characterOffset: 3}) as IListResult[];
    }

    public async describe(serviceName: string, argv: IRunArgv) {
        return await this._exec(["describe", serviceName], argv);
    }

    public async delete(serviceName: string, argv: IRunArgv) {
        return await this._exec(["delete", serviceName], argv);
    }
}
