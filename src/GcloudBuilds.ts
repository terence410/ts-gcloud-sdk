// https://cloud.google.com/sdk/gcloud/reference/projects

import {GcloudBase} from "./GcloudBase";
import {IStandardListArgv} from "./types";

type IListResult = {
    id: string,
    createTime: string,
    duration: string,
    source: string,
    images: string,
    status: string,
};

// argv

type ISubmitArgv = {
    noSource?: boolean,
    async?: boolean,
    diskSize?: number,
    gcsLogDir?: string,
    gcsSourceStagingDir?: string,
    ignoreFile?: string,
    machineType?: "n1-highcpu-32" | "n1-highcpu-8",
    substitutions?: string | object,
    timeout?: string,
    config?: string,
    tag: string,
};

export class GcloudBuilds extends GcloudBase {
    public commandPrefix = "builds";

    public async list(argv: IStandardListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["id", "createTime", "duration", "source", "images", "status"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async describe(buildName: string) {
        return await this._exec(["describe", buildName]);
    }

    public async cancel(buildNames: string | string[]) {
        buildNames = Array.isArray(buildNames) ? buildNames.join(" ") : buildNames;
        return await this._exec(["log", buildNames]);
    }

    public async log(buildName: string) {
        return await this._exec(["log", buildName]);
    }

    public async submit(argv: ISubmitArgv): Promise<any>;
    public async submit(source: string, argv: ISubmitArgv): Promise<any>;
    public async submit(...args: any[]): Promise<any> {
        if (args.length === 1) {
            return await this._exec(["submit"], args[0]);
        } else {
            return await this._exec(["submit", args[0]], args[1]);
        }
    }
}
