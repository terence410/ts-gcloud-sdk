// https://cloud.google.com/sdk/gcloud/reference/container/clusters

import {GcloudBase} from "../GcloudBase";
import {IStandardListArgv} from "../types";

type IListResult = {
    name: string,
    location: string,
    masterVersion: string,
    masterIp: string,
    machineType: string,
    nodeVersion: string,
    numNodes: string,
    status: string,
};

// argv

type IDefaultArgv = {
    zone?: string,
    region?: string,
};

type IListArgv = IDefaultArgv & IStandardListArgv;

type ICreateArgv = IDefaultArgv & {
    scopes: string,
    enableStackdriverKubernetes: boolean,
    machineType: string,
    addons: string,
};

export class GcloudContainerClusters extends GcloudBase {
    public commandPrefix: string = "container clusters";

    public async list(argv: IListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["name", "location", "masterVersion", "masterIp", "machineType", "nodeVersion", "numNodes", "status"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async create(clusterName: string, argv: ICreateArgv) {
        return await this._exec(["create", clusterName], argv);
    }

    public async describe(clusterName: string, argv: IDefaultArgv) {
        const result = await this._exec(["describe", clusterName], argv);
        return this._parseYaml(result);
    }

    public async delete(clusterName: string, argv: IDefaultArgv) {
        await this._exec(["delete", clusterName], argv);
    }
}
