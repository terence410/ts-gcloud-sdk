// https://cloud.google.com/sdk/gcloud/reference/app/services

import {GcloudBase} from "../GcloudBase";
import {IStandardListArgv} from "../types";

type IListResult = {
    service: string,
    numVersions: string,
};

type IDescribeResult = {
    id: string,
    name: string,
    split: { allocations: {[key: string]: number} },
};

// argv

type IBrowseArgv = {
    launchBrowser?: boolean,
    version?: string,
};

type ISetTrafficArgv = {
    splits: string,
    migrate?: string,
    splitBy?: string,
};

export class GcloudAppServices extends GcloudBase {
    public commandPrefix: string = "app services";

    public async list(argv: IStandardListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["service", "numVersions"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async describe(service: string) {
        const result = await this._exec(["describe", service]);
        return this._parseYaml(result);
    }

    public async delete(service: string) {
        return await this._exec(["delete", service]);
    }

    public async browse(service: string, argv: IBrowseArgv = {}) {
        return await this._exec(["browse", service], argv);
    }

    public async setTraffic(services: string, argv: ISetTrafficArgv): Promise<any>;
    public async setTraffic(argv: ISetTrafficArgv): Promise<any>;
    public async setTraffic(...argv: any[]): Promise<any> {
        if (argv.length === 1) {
            return await this._exec(["set-traffic"], argv[0]);
        } else {
            const values = Array.isArray(argv[0]) ? argv[0].join(" ") : argv[0];
            return await this._exec(["set-traffic", values], argv[1]);
        }
    }
}
