// https://cloud.google.com/sdk/gcloud/reference/scheduler/

import {GcloudBase} from "./GcloudBase";

type IListResult = {
    id: string,
    location: string,
    schedule: string,
    targetType: string,
    state: string,
};

// argument

type ICreateOrUpdateArgv = {
    schedule?: string,
    uri?: string,
    timeZone?: string,
    description?: string,
    httpMethod?: string,
    attemptDeadline?: string,
    maxBackoff?: string,
    minBackoff?: string,
    maxDoublings?: number,
    maxRetryAttempts?: number,
    maxRetryDuration?: number,
    messageBody?: string,
};

type ICreateArgv = ICreateOrUpdateArgv | {
    headers?: string,
};

type IUpdateArgv = ICreateOrUpdateArgv | {
    updateHeaders?: string,
    clearHeaders?: boolean,
    clearMaxBackoff?: boolean,
    clearMaxDoublings?: boolean,
    clearMaxRetryAttempts?: boolean,
    clearMaxRetryDuration?: boolean,
    clearMessageBody?: boolean,
};

type IListArgv = {
    limit?: number,
    pageSize?: number,
};

export class GcloudSchedulerJobs extends GcloudBase {
    public async list(argument: IListArgv = {}) {
        const table = await this._exec(["list"], argument);
        const headers = ["id", "location", "schedule", "targetType", "state"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async createHttp(name: string, argument: ICreateArgv = {}) {
        return await this._exec(["create", "http", name], argument);
    }

    public async updateHttp(name: string, argument: IUpdateArgv = {}) {
        return await this._exec(["update", "http", name], argument);
    }

    // helper
    public async createOrUpdateHttp(name: string, argument: ICreateOrUpdateArgv = {}) {
        try {
            return await this.createHttp(name, argument);
        } catch (err) {
            if (!err.message.match(/ALREADY_EXISTS|already exists/i)) {
                throw err;
            }
        }

        return await this.updateHttp(name, argument);
    }

    public async delete(name: string) {
        const params: string[] = [];
        return await this._exec(["delete", name]);
    }

    public async describe(name: string): Promise<string | undefined> {
        try {
            return await this._exec(["describe", name]);
        } catch (err) {
            return;
        }
    }

    public async pause(name: string) {
        return await this._exec(["pause", name]);
    }

    public async resume(name: string) {
        return await this._exec(["resume", name]);
    }

    public async run(name: string) {
        return await this._exec(["run", name]);
    }
}
