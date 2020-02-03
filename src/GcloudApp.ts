// https://cloud.google.com/sdk/gcloud/reference/app
// https://cloud.google.com/appengine/docs/standard/python/config/appref

import {GcloudAppDomainMappings} from "./GcloudApp/GcloudAppDomainMappings";
import {GcloudAppFirewallRules} from "./GcloudApp/GcloudAppFirewallRules";
import {GcloudAppInstances} from "./GcloudApp/GcloudAppInstances";
import {GcloudAppLogs} from "./GcloudApp/GcloudAppLogs";
import {GcloudAppServices} from "./GcloudApp/GcloudAppServices";
import {GcloudBase} from "./GcloudBase";

type IRegionsListResult = {
    region: string,
    supportsStandard: string,
    supportsFlexible: string,
};

// argv

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
    public async browse(argv: IBrowseArgv = {}) {
        return await this._exec(["browse"], argv);
    }

    public async create(argv: ICreateArgv) {
        return await this._exec(["create"], argv);
    }

    public async describe() {
        return await this._exec(["describe"]);
    }

    public async deploy(argv: IDeployArgv = {}) {
        return await this._exec(["deploy"], argv);
    }

    public async openConsole(argv: IServiceArgv) {
        return await this._exec(["open-console"], argv);
    }

    public logs() {
        return new GcloudAppLogs("app logs", this.project, this.projectOptions);
    }

    public instances() {
        return new GcloudAppInstances("app instances", this.project, this.projectOptions);
    }

    public domainMappings() {
        return new GcloudAppDomainMappings("app domain-mappings", this.project, this.projectOptions);
    }

    public firewallRules() {
        return new GcloudAppFirewallRules("app firewall-rules", this.project, this.projectOptions);
    }

    public services() {
        return new GcloudAppServices("app services", this.project, this.projectOptions);
    }

    public async regions() {
        const table = await this._exec(["regions list"]);
        const headers = ["region", "supportsStandard", "supportsFlexible"];
        return this._parseTable(table, headers, true) as IRegionsListResult[];
    }
}
