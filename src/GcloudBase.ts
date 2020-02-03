import Debug from "debug";
import {IProjectOptions} from "./GcloudSdk";
import {GcloudCommandHelper} from "./helpers/GcloudCommandHelper";
import {camelToDash, camelToSnakeCapitalize, escapeQuotes} from "./utils";

const debug = Debug("gcloud");
const sdkPath = process.env.GCP_SDK_PATH || "gcloud";

export class GcloudBase {
    constructor(
                public commandPrefix: string,
                public readonly project: string,
                public projectOptions: Partial<IProjectOptions>) {
    }

    public async help() {
        return await this._exec(["--help"]);
    }

    // region protected methods

    protected _createChildProcessHelper() {
        const helper = new GcloudCommandHelper(this.projectOptions);
        helper.addParams([this.commandPrefix]);
        helper.addArgument({project: this.project, quiet: ""});
        return helper;
    }

    protected async _exec(params: string[], argument: {[key: string]: any} = {}, postParams: string[] = []): Promise<string> {
        const helper = this._createChildProcessHelper();
        helper.addArgument(argument);
        helper.addParams(params);
        helper.addPosParams(postParams);
        const result = await helper.exec();
        return result.stdout || result.stderr;
    }

    protected _parseTable(table: string, headers?: string[], isSplitBySpace = false) {
        const rows = table.trim().split(/\r?\n/);
        let list: any[] = [];

        if (rows.length) {
            if (headers) {
                const headerRow = rows[0];
                const indexes: number[] = [];
                for (const header of headers) {
                    const snakeHeader = camelToSnakeCapitalize(header);
                    indexes.push(headerRow.indexOf(snakeHeader));
                }

                for (const line of rows.slice(1)) {
                    const listResult: any = {};
                    
                    if (isSplitBySpace) {
                        const lines = line.split(/[ ]+/);
                        headers.map((header, index) => {
                            listResult[header] = lines[index];
                        });
                        list.push(listResult);

                    } else {
                        headers.map((header, index) => {
                            const x0 = indexes[index];
                            const x1 = index + 1 < indexes.length ? indexes[index + 1] - x0 : undefined;
                            listResult[header] = line.substr(x0, x1).trim();
                        });
                        list.push(listResult);
                    }
                }
            } else {
                list = rows.slice(1);
            }
        }

        return list;
    }

    // endregion

}
