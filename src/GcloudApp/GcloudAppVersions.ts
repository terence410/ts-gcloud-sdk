// https://cloud.google.com/sdk/gcloud/reference/app/services

import {GcloudBase} from "../GcloudBase";
import {IStandardListArgv} from "../types";

type IListResult = {
    service: string,
    versionId: string,
    trafficSplit: string,
    lastDeployed: string,
    servingStatus: string,
};

type IDescribeResult = {
    createTime: string,
    createdBy: string,
    deployment: {files: {[key: string]: {sha1Sum: string, sourceUrl: string}}},
    diskUsageBytes: string,
    env: string,
    handlers: Array<{ authFailAction: string, login: string, script: object, securityLevel: string, urlRegex: string}>,
    id: string,
    instanceClass: string,
    name: string,
    network: object,
    runtime: string,
    runtimeChannel: string,
    servingStatus: string,
    threadsafe: true,
    versionUrl: string,
};

// argv

type IDefaultArgv = {
    service?: string;
};

type IDescribeArgv = {
    service: string;
};

type IListArgv = IStandardListArgv & {
    hideNoTraffic?: boolean,
    service?: string,
};

type IBrowseArgv = {
    launchBrowser?: boolean,
    version?: string,
};

export class GcloudAppVersions extends GcloudBase {
    public commandPrefix: string = "app versions";

    public async browse(services: string, argv: IBrowseArgv = {}) {
        const values = Array.isArray(services) ? services.join(" ") : services;
        return await this._exec(["browse", values], argv);
    }

    public async delete(version: string, argv: IDefaultArgv = {}) {
        return await this._exec(["delete", version], argv);
    }

    public async describe(version: string, argv: IDescribeArgv) {
        const result = await this._exec(["describe", version], argv);
        return this._parseYaml(result) as IDescribeResult;
    }

    public async list(argv: IListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["service", "versionId", "trafficSplit", "lastDeployed", "servingStatus"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async migrate(version: string, argv: IDefaultArgv = {}) {
        return await this._exec(["migrate", version], argv);
    }

    public async start(version: string, argv: IDefaultArgv = {}) {
        return await this._exec(["start", version], argv);
    }

    public async stop(version: string, argv: IDefaultArgv = {}) {
        return await this._exec(["stop", version], argv);
    }
}
