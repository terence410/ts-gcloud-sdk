// https://cloud.google.com/sdk/gcloud/reference/projects

import {GcloudBase} from "./GcloudBase";
import {IStandardListArgv} from "./types";

type IListResult = {
    active: string,
    account: string,
};

// argv

type ITokenArgv = {
    audiences?: string | string [],
    includeEmail?: boolean,
    includeLicense?: boolean,
    tokenFormat?: "standard" | "full",
};

export class GcloudAuth extends GcloudBase {
    public commandPrefix = "auth";

    public async list(argv: IStandardListArgv = {}) {
        const table = await this._exec(["list"], argv);
        const headers = ["active", "account"];
        return this._parseTable(table, headers, {contentOffset: 1}) as IListResult[];
    }

    public async printAccessToken(account: string, argv: ITokenArgv = {}) {
        const result = await this._exec(["print-access-token", account], argv);
        return result.trim();
    }

    public async printIdentityToken(account: string, argv: ITokenArgv = {}) {
        const result = await this._exec(["print-identity-token", account], argv);
        return result.trim();
    }
}
