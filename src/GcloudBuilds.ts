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

type IDescribeResult = {
    artifacts?: { images: string[] },
    createTime: string,
    finishTime: string,
    id: string,
    images?: string[],
    logUrl: string,
    logsBucket: string,
    options: {
        logStreamingOption?: string,
        logging: string
        substitutionOption?: string,
    },
    projectId: string,
    results: {
        buildStepImages: string[],
        images?: Array<{ digest: string, name: string, pushTiming: { startTime: string, endTime: string } }>,
        buildStepOutputs: string[],
    },
    source?: {
        storageSource: { bucket: string, generation: string, object: string },
    },
    sourceProvenance: {
        fileHashes?: object,
        resolvedStorageSource?: { bucket: string, generation: string, object: string },
    },
    startTime: string,
    status: string,
    steps: Array<{
        args: string[],
        name: string,
        pullTiming: { startTime: string, endTime: string },
        status: string,
        timing: { startTime: string, endTime: string },
    }>,
    substitutions: object,
    timeout: string,
    timing: {
        BUILD: {
            endTime: string,
            startTime: string,
        },
        FETCHSOURCE?: {
            endTime: string,
            startTime: string,
        },
        PUSH?: {
            endTime: string,
            startTime: string,
        },
    },
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
        const result = await this._exec(["describe", buildName]);
        return this._parseYaml(result) as IDescribeResult;
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
