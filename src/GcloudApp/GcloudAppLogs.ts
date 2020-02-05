// https://cloud.google.com/sdk/gcloud/reference/app/logs/

import {GcloudBase} from "../GcloudBase";

// argv

type ITailArgv = {
    level?: "critical" | "error" | "warning" | "info" | "debug" | "any",
    logs?: string,
    service?: string,
    version?: string,
};

type IReadArgv = ITailArgv & {limit?: number};

export class GcloudAppLogs extends GcloudBase {
    public commandPrefix: string = "app logs";

    public async read(argv: IReadArgv = {}) {
        return await this._exec(["read"], argv);
    }

    // Not supported
    // public async tail(argv: ITailArgv = {}) {
    //     return await this._exec(["tail"], argv);
    // }
}
