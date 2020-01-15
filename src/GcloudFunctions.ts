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

// argument

type IDeployArgv = {
    region: string,
    entryPoint?: string,
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
    region: string,
};

type IListArgv = {
    limit?: number,
    regions?: string[],
    uri?: boolean,
};

type IDescribeArgv = {
    region: string,
};

type ICallArgv = {
    region: string,
    data?: string | object,
};

type IAddIamPolicyBindingArgv = {
    region?: string,
    member: "allUsers" | string,
    role: "roles/cloudfunctions.invoker" | string,
};

export class GcloudFunctions extends GcloudBase {
    public runtimes = runtimes;
    public memory = memory;

    public async list(argument: IListArgv = {}) {
        const table = await this._exec(["list"],  argument);
        const headers = ["name", "status", "trigger", "region"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async deploy(name: string, argument: IDeployArgv) {
        return await this._exec(["deploy", name], argument);
    }

    public async delete(name: string, argument: IDeleteArgv) {
        const params: string[] = [];
        return await this._exec(["delete", name], argument);
    }

    public async call(name: string, argument: ICallArgv) {
        return await this._exec(["call", name], argument);
    }

    public async addIamPolicyBinding(name: string, argument: IAddIamPolicyBindingArgv) {
        return await this._exec(["add-iam-policy-binding", name], argument);
    }

    public async describe(name: string, argument: IDescribeArgv): Promise<string | undefined> {
        try {
            return await this._exec(["describe", name], argument);
        } catch (err) {
            return;
        }
    }

    public async logs() {
        const table = await this._exec(["logs", "read"]);
        const headers = ["level", "name", "executionId", "timeUtc", "log"];
        return this._parseTable(table, headers) as ILogsResult[];
    }

    public async eventTypes() {
        const table = await this._exec(["event-types", "list"]);
        const headers = ["eventProvider", "eventType", "eventTypeDefault", "resourceType", "resourceOptional"];
        return this._parseTable(table, headers) as IEventTypesResult[];
    }

    public async regions() {
        const table = await this._exec(["regions", "list"]);
        return this._parseTable(table) as string[];
    }
}
