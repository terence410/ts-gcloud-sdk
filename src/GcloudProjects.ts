// https://cloud.google.com/sdk/gcloud/reference/projects

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

export class GcloudProjects extends GcloudBase {
    public commandPrefix = "projects";

    public async list(argv: IListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["projectId", "name", "projectNumber"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async describe(name: string) {
        return await this._exec(["describe", name]);
    }
}
