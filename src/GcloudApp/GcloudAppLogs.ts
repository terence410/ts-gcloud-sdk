// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "../GcloudBase";

type IListResult = {
    projectId: string,
    name: string,
    projectNumber: string,
};

// argv

type ITailArgv = {
    level?: "critical" | "error" | "warning" | "info" | "debug" | "any",
    logs?: string,
    service?: string,
    version?: string,
};

type IReadArgv = ITailArgv & {limit?: number};

export class GcloudAppLogs extends GcloudBase {
    public async read(argv: IReadArgv = {}) {
        return await this._exec(["read"], argv);
    }

    public async tail(argv: ITailArgv = {}) {
        return await this._exec(["tail"], argv);
    }
}
