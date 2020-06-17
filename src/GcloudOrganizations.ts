// https://cloud.google.com/sdk/gcloud/reference/organizations

import {GcloudBase} from "./GcloudBase";

type IListResult = {
    id: string,
    location: string,
    schedule: string,
    targetType: string,
    state: string,
};

// argv

type IListArgv = {
    limit?: number,
    pageSize?: number,
};

export class GcloudOrganizations extends GcloudBase {
    public commandPrefix: string = "organizations";

    public async list(argv: IListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["displayName", "id", "directoryCustomerId"];
        return this._parseTable(table, headers, {isSplitBySpace: true}) as IListResult[];
    }

    public async describe(name: string) {
        return await this._exec(["describe", name]);
    }
}
