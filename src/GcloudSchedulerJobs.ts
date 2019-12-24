// https://cloud.google.com/sdk/gcloud/reference/scheduler/

import {GcloudBase} from "./GcloudBase";

type IListResult = {
    id: string,
    location: string,
    schedule: string,
    targetType: string,
    state: string,
};

// argv

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
    public async list(argv: IListArgv = {}) {
        const table = await this._quickExec("list", "", argv);
        const headers = ["id", "location", "schedule", "targetType", "state"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async createHttp(name: string, argv: ICreateArgv = {}) {
        return await this._quickExec("create http", name, argv);
    }

    public async updateHttp(name: string, argv: IUpdateArgv = {}) {
        return await this._quickExec("update http", name, argv);
    }

    // helper
    public async createOrUpdateHttp(name: string, argv: ICreateOrUpdateArgv = {}) {
        try {
            return await this.createHttp(name, argv);
        } catch (err) {
            if (!err.message.match(/ALREADY_EXISTS|already exists/i)) {
                throw err;
            }
        }

        return await this.updateHttp(name, argv);
    }

    public async delete(name: string) {
        const params: string[] = [];
        this._addParam(params, "delete", name);
        return await this._execInteractive(params, [{match: "", respond: "Y"}], {initStdin: "\n"});
    }

    public async describe(name: string): Promise<string | undefined> {
        try {
            return await this._quickExec("describe", name);
        } catch (err) {
            return;
        }
    }

    public async pause(name: string) {
        return await this._quickExec("pause", name);
    }

    public async resume(name: string) {
        return await this._quickExec("resume", name);
    }

    public async run(name: string) {
        return await this._quickExec("run", name);
    }
}
