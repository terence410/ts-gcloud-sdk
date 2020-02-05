// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "../GcloudBase";

type IListResult = {
    service: string,
    version: string,
    id: string,
    vmStatus: string,
    debugMode: string,
};

// argv

type IDefaultArgv = {
    service: string,
    version: string,
};

type IListArgv = {
    filter?: string,
    limit?: number,
    pageSize?: number,
    sortBy?: string,
    uri?: boolean,
};

export class GcloudAppInstances extends GcloudBase {
    public commandPrefix: string = "app instances";

    public async list(argv: IListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["service", "version", "id", "vmStatus", "debugMode"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async describe(instance: string, argv: IDefaultArgv) {
        return await this._exec(["describe", instance], argv);
    }

    public async enableDebug(instance: string, argv: IDefaultArgv) {
        return await this._exec(["enableDebug", instance], argv);
    }

    public async disableDebug(instance: string, argv: IDefaultArgv) {
        return await this._exec(["disableDebug", instance], argv);
    }

    public async ssh(instance: string, command: string, argv: IDefaultArgv) {
        return await this._exec(["ssh", instance], argv, ["-- " + command]);
    }

    public async delete(instance: string, argv: IDefaultArgv) {
        return await this._exec(["delete", instance], argv);
    }
}
