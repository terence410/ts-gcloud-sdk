// https://cloud.google.com/sdk/gcloud/reference/projects

import {GcloudBase} from "./GcloudBase";
import {escapeQuotes} from "./utils";

type IListResult = {
    projectId: string,
    name: string,
    projectNumber: string,
};

type IResourceDescriptors = {
    name: string,
    description: string,
    key: string,
};

// argv

type IListArgv = {
    limit?: number,
    sortBy?: string[],
};

type IReadFilter = {
    ["resource.type"]?: string,
};

type IReadArgv = {
    limit?: number,
    sortBy?: string[],
};

export class GcloudLogging extends GcloudBase {
    public commandPrefix: string = "logging";

    public async listLogs(argv: IListArgv = {}): Promise<string[]> {
        const table = await this._exec(["logs", "list"], argv);
        return this._parseTable(table);
    }

    public async resourceDescriptors(): Promise<IResourceDescriptors[]> {
        const table = await this._exec(["resource-descriptors", "list"]);
        const headers = ["type", "description", "key"];
        return this._parseTable(table, headers);
    }

    public async read(filter: IReadFilter, argv: IReadArgv = {}) {
        const filterString = "\"" + Object.entries(filter).map(x => `${x[0]}=${x[1]}`).join(" AND ") + "\"";
        return await this._exec(["read", filterString], argv);
    }

    public async write(logName: string, data: any) {
        const message = escapeQuotes(JSON.stringify(data));
        return await this._exec([`write ${logName}`, message]);
    }
}
