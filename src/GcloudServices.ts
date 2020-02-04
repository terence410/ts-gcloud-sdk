// https://cloud.google.com/sdk/gcloud/reference/projects

import {GcloudBase} from "./GcloudBase";
import {IStandardListArgv} from "./types";

type IListResult = {
    active: string,
    account: string,
};

// argv

export class GcloudServices extends GcloudBase {
    public commandPrefix = "services";

    public async list(argv: IStandardListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["active", "account"];
        return this._parseTable(table, headers, {contentOffset: 1}) as IListResult[];
    }

    public async enable(serviceName: string) {
        return await this._exec(["enable", serviceName]);
    }
}
