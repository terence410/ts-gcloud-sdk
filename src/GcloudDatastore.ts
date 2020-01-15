// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "./GcloudBase";
import {GcloudDatastoreIndexes} from "./GcloudDatastore/GcloudDatastoreIndexes";

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
    public indexes() {
        return new GcloudDatastoreIndexes(this.project, "datastore indexes", this.projectOptions);
    }
}
