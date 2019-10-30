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
    public async list(argv: IListArgv = {}) {
        const table = await this._quickExec("list", "", argv);
        const headers = ["displayName", "id", "directoryCustomerId"];
        return this._parseTable(table, headers, true) as IListResult[];
    }

    public async describe(name: string) {
        return await this._quickExec("describe", name);
    }
}
