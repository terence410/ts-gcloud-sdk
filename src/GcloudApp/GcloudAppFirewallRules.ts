// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "../GcloudBase";

type IListResult = {
    priority: string,
    action: string,
    sourceRange: string,
    description: string,
};

// argv

type IListArgv = {
    filter?: string,
    limit?: number,
    pageSize?: number,
    sortBy?: string,
    uri?: boolean,
};

export class GcloudAppFirewallRules extends GcloudBase {
    public async list(argv: IListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["priority", "action", "sourceRange", "description"];
        return this._parseTable(table, headers) as IListResult[];
    }
}
