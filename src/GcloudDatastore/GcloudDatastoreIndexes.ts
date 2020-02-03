// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "../GcloudBase";

type IListResult = {
    projectId: string,
    name: string,
    projectNumber: string,
};

// argv

type IListArgv = {
    limit?: number,
    pageSize?: number,
};

export class GcloudDatastoreIndexes extends GcloudBase {
    public commandPrefix: string = "datastore indexes";

    public async create(filename: string) {
        const params: string[] = [];
        return await this._exec(["create", filename]);
    }

    public async cleanup(filename: string) {
        const params: string[] = [];
        return await this._exec(["cleanup", filename]);
    }

    public async list() {
        return await this._exec(["list"]);
    }

    public async describe(indexId: string) {
        return await this._exec(["describe", indexId]);
    }
}
