// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "./GcloudBase";
import {GcloudDatastoreIndexes} from "./GcloudDatastore/GcloudDatastoreIndexes";

type IListResult = {
    projectId: string,
    name: string,
    projectNumber: string,
};

// argv

type IImportExportArgv = {
    kinds?: string[],
    namespaces?: string[],
    operationLabels?: string[],
};

export class GcloudDatastore extends GcloudBase {
    public indexes() {
        return new GcloudDatastoreIndexes("datastore indexes", this.project, this.projectOptions);
    }

    public async export(outputUrlPrefix: string, argument: IImportExportArgv) {
        return await this._exec(["export", outputUrlPrefix], argument);
    }

    public async import(outputUrlPrefix: string, argument: IImportExportArgv = {}) {
        return await this._exec(["import", outputUrlPrefix], argument);
    }

}
