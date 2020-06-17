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

export class GcloudAppDomainMappings extends GcloudBase {
    public commandPrefix: string = "app domain-mappings";

    public async list() {
        return await this._exec(["list"]);
    }
}
