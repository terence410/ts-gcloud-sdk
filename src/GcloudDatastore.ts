// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "./GcloudBase";

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

export class GcloudDatastore extends GcloudBase {
    public async createIndexes(filename: string) {
        const params: string[] = [];
        return await this._quickExec("indexes create", filename);
    }

    public async cleanupIndexes(filename: string) {
        const params: string[] = [];
        return await this._quickExec("indexes cleanup", filename);
    }

    public async listIndexes() {
        return await this._quickExec("indexes list");
    }

    public async describeIndexes(indexId: string) {
        return await this._quickExec("indexes describe", indexId);
    }
}
