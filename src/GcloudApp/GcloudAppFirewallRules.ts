// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "../GcloudBase";
import {IStandardListArgv} from "../types";

type IListResult = {
    priority: string,
    action: string,
    sourceRange: string,
    description: string,
};

// argv

export class GcloudAppFirewallRules extends GcloudBase {
    public commandPrefix: string = "app firewall-rules";

    public async list(argv: IStandardListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["priority", "action", "sourceRange", "description"];
        return this._parseTable(table, headers) as IListResult[];
    }
}
