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
    region: string,
    allowUnauthenticated?: boolean,
    entryPoint?: string,
    ignoreFile?: string,
    memory?: string,
    retry?: boolean,
    runtime?: string,
    serviceAccount?: string,
    stageBucket?: string,
    source?: string,
    timeout?: string,
    updateLabels?: object,
    clearEnvVars?: boolean,
    envVarsFile?: string,
    setEnvVars?: string | object,
    removeEnvVars?: string,
    updateEnvVars?: string | object,
    clearLabels?: boolean,
    removeLabels?: string | string[],
    clearMaxInstances?: boolean,
    maxInstances?: number,
    clearVpcConnector?: boolean,
    vpcConnector?: string,
    triggerBucket?: string,
    triggerHttp?: boolean,
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
    public commandPrefix: string = "functions";
    public runtimes = runtimes;
    public memory = memory;

    public async list(argv: IListArgv = {}) {
        const table = await this._exec(["list"],  argv);
        const headers = ["name", "status", "trigger", "region"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async deploy(name: string, argv: IDeployArgv) {
        return await this._exec(["deploy", name], argv);
    }

    public async delete(name: string, argv: IDeleteArgv) {
        const params: string[] = [];
        return await this._exec(["delete", name], argv);
    }

    public async call(name: string, argv: ICallArgv) {
        if (typeof argv.data === "object") {
            argv.data = JSON.stringify(argv.data);
        }

        return await this._exec(["call", name], argv);
    }

    public async addIamPolicyBinding(name: string, argv: IAddIamPolicyBindingArgv) {
        return await this._exec(["add-iam-policy-binding", name], argv);
    }

    public async describe(name: string, argv: IDescribeArgv): Promise<string | undefined> {
        try {
            return await this._exec(["describe", name], argv);
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
