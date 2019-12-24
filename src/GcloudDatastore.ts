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
        this._addParam(params, "indexes create", filename);
        return await this._execInteractive(params, [{match: "Do you want to", respond: "Y"}],
            {initStdin: "\n"});
    }

    public async cleanupIndexes(filename: string) {
        const params: string[] = [];
        this._addParam(params, "indexes cleanup", filename);
        return await this._execInteractive(params, [{match: "Do you want to", respond: "Y"}],
            {initStdin: "\n", sendNewLineOnStderr: true});
    }

    public async listIndexes() {
        return await this._quickExec("indexes list");
    }

    public async describeIndexes(indexId: string) {
        return await this._quickExec("indexes describe", indexId);
    }
}
