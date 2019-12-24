// https://cloud.google.com/sdk/gcloud/reference/functions/deploy

import {memory} from "./enums/functions/memory";
import {runtimes} from "./enums/functions/runtimes";
import {GcloudBase} from "./GcloudBase";

type IListResult = {
    name: string,
    status: string,
    trigger: string,
    region: string,
};

type ILogsResult = {
    level: string,
    name: string,
    executionId: string,
    timeUtc: string,
    log: string,
};

type IEventTypesResult = {
    eventProvider: string,
    eventType: string,
    eventTypeDefault: string,
    resourceType: string,
    resourceOptional: string,
};

// argv

type IDeployArgv = {
    entryPoint?: string,
    region?: string,
    runtime?: string,
    memory?: string,
    retry?: boolean,
    timeout?: string,
    maxInstances?: number,
    clearMaxInstances?: boolean,
    clearEnvVars?: boolean,
    setEnvVars?: string,
    removeEnvVars?: string,
    updateEnvVars?: string,
    triggerHttp?: boolean,
    triggerBucket?: string,
    triggerTopic?: string,
    triggerEvent?: string,
    triggerResource?: string,
};

type IDeleteArgv = {
    region?: string,
};

type IListArgv = {
    limit?: number,
    regions?: string[],
    uri?: boolean,
};

type IDescribeArgv = {
    region?: string,
};

type ICallArgv = {
    region?: string,
    data?: string | object,
};

export class GcloudFunctions extends GcloudBase {
    public runtimes = runtimes;
    public memory = memory;

    public async list(argv: IListArgv = {}) {
        const table = await this._quickExec("list", "", argv);
        const headers = ["name", "status", "trigger", "region"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async deploy(name: string, argv: IDeployArgv = {}) {
        return await this._quickExec("deploy", name, argv);
    }

    public async delete(name: string, argv: IDeleteArgv = {}) {
        const params: string[] = [];
        this._addParam(params, "delete", name);
        this._addArgv(params, argv);
        return await this._execInteractive(params, [{match: "", respond: "Y"}], {initStdin: "\n"});
    }

    public async call(name: string, argv: ICallArgv = {}) {
        return await this._quickExec("call", name, argv);
    }

    public async describe(name: string, argv: IDescribeArgv = {}): Promise<string | undefined> {
        try {
            return await this._quickExec("describe", name, argv);
        } catch (err) {
            return;
        }
    }

    public async logs() {
        const table = await this._quickExec("logs", "read");
        const headers = ["level", "name", "executionId", "timeUtc", "log"];
        return this._parseTable(table, headers) as ILogsResult[];
    }

    public async eventTypes() {
        const table = await this._quickExec("event-types", "list");
        const headers = ["eventProvider", "eventType", "eventTypeDefault", "resourceType", "resourceOptional"];
        return this._parseTable(table, headers) as IEventTypesResult[];
    }

    public async regions() {
        const table = await this._quickExec("regions", "list");
        return this._parseTable(table) as string[];
    }
}
