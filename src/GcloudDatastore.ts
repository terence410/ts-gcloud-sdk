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
    public commandPrefix: string = "datastore";

    public async export(outputUrlPrefix: string, argv: IImportExportArgv) {
        return await this._exec(["export", outputUrlPrefix], argv);
    }

    public async import(outputUrlPrefix: string, argv: IImportExportArgv = {}) {
        return await this._exec(["import", outputUrlPrefix], argv);
    }

    public indexes() {
        return this.extend(GcloudDatastoreIndexes);
    }

}
