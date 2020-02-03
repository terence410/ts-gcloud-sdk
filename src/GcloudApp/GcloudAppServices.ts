// https://cloud.google.com/sdk/gcloud/reference/datastore/

import {GcloudBase} from "../GcloudBase";

type IListResult = {
    service: string,
    numVersions: string,
};

// argv

type IListArgv = {
    filter?: string,
    limit?: number,
    pageSize?: number,
    sortBy?: string,
    uri?: boolean,
};

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
    public async list(argv: IListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["service", "numVersions"];
        return this._parseTable(table, headers) as IListResult[];
    }

    public async describe(service: string) {
        return await this._exec(["describe", service]);
    }

    public async delete(services: string | string[]) {
        const values = Array.isArray(services) ? services.join(" ") : services;
        return await this._exec(["delete", values]);
    }

    public async browse(services: string, argv: IBrowseArgv = {}) {
        const values = Array.isArray(services) ? services.join(" ") : services;
        return await this._exec(["browse", values], argv);
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
