// https://cloud.google.com/sdk/gcloud/reference/app
// https://cloud.google.com/appengine/docs/standard/python/config/appref

import {GcloudAppDomainMappings} from "./GcloudApp/GcloudAppDomainMappings";
import {GcloudAppFirewallRules} from "./GcloudApp/GcloudAppFirewallRules";
import {GcloudAppInstances} from "./GcloudApp/GcloudAppInstances";
import {GcloudAppLogs} from "./GcloudApp/GcloudAppLogs";
import {GcloudAppServices} from "./GcloudApp/GcloudAppServices";
import {GcloudBase} from "./GcloudBase";
import {GcloudDatastoreIndexes} from "./GcloudDatastore/GcloudDatastoreIndexes";

type IRegionsListResult = {
    region: string,
    supportsStandard: string,
    supportsFlexible: string,
};

// argument

type IBrowseArgv = {
    launchBrowser?: boolean,
    service?: string,
    version?: string,
};

type ICreateArgv = {
    region: string,
};

type IDeployArgv = {
    bucket?: string,
    ignoreFile?: string,
    imageUrl?: string,
    promote?: boolean,
    noPromote?: boolean,
    stopPreviousVersion?: boolean,
    version?: string,
};

export type IServiceArgv = {
    service: string,
    version: string,
};

export class GcloudApp extends GcloudBase {
    public commandPrefix: string = "app";

    public async browse(argument: IBrowseArgv = {}) {
        return await this._exec(["browse"], argument);
    }

    public async create(argument: ICreateArgv) {
        return await this._exec(["create"], argument);
    }

    public async describe() {
        return await this._exec(["describe"]);
    }

    public async deploy(argument: IDeployArgv = {}) {
        return await this._exec(["deploy"], argument);
    }

    public async openConsole(argument: IServiceArgv) {
        return await this._exec(["open-console"], argument);
    }

    public async regions() {
        const table = await this._exec(["regions list"]);
        const headers = ["region", "supportsStandard", "supportsFlexible"];
        return this._parseTable(table, headers, {isSplitBySpace: true}) as IRegionsListResult[];
    }

    public logs() {
        return this.extend(GcloudAppLogs);
    }

    public instances() {
        return this.extend(GcloudAppInstances);
    }

    public domainMappings() {
        return this.extend(GcloudAppDomainMappings);
    }

    public firewallRules() {
        return this.extend(GcloudAppFirewallRules);
    }

    public services() {
        return this.extend(GcloudAppServices);
    }

}
