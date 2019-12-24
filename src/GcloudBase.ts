import Debug from "debug";
import {IProjectOptions} from "./GcloudSdk";
import {IInteractive} from "./helpers/ChildProcessHelper";
import {ChildProcessHelper} from "./helpers/ChildProcessHelper";
import {camelToDash, camelToSnakeCapitalize, escapeQuotes} from "./utils";

const debug = Debug("gcloud");
const sdkPath = process.env.GCP_SDK_PATH || "gcloud";

export class GcloudBase {
    constructor(public readonly project: string, private _product: string, private _options: IProjectOptions = {}) {
    }

    public async help() {
        return await this._exec(["--help"]);
    }

    // region protected methods

    protected async _quickExec(type: string, value: string = "", argv: {[key: string]: any} = {}): Promise<string> {
        const params: string[] = [];
        this._addParam(params, type, value);
        this._addArgv(params, argv);
        return await this._exec(params);
    }

    protected async _exec(params: string[] = []): Promise<string> {
        // update the params
        params = [this._product, ...params, "--project", this.project];

        try {
            const result = await new ChildProcessHelper(sdkPath, params, this._options)
                .exec();
            return result.stdout || result.stderr;

        } catch (err) {
            throw  err;

        }
    }

    protected async _execInteractive(params: string[] = [], interactives: IInteractive[],
                                     options: {initStdin?: string, sendNewLineOnStderr?: boolean} = {}):
        Promise<string> {
        // update the params
        params = [this._product, "--project", this.project, ...params];

        try {
            const result = await new ChildProcessHelper(sdkPath, params, this._options)
                .execInteractive(interactives, options);
            return result.stdout || result.stderr;

        } catch (err) {
            throw err;

        }
    }

    protected _addParam(params: string[] = [], name: string, value?: string) {
        params.push(name);

        if (value && value !== "") {
            params.push(value);
        }
    }

    protected _addArgv(params: string[] = [], argv: {[key: string]: any}) {
        for (const [name, value] of Object.entries(argv)) {
            this._addSingleArgv(params, name, value);
        }
    }

    protected _addSingleArgv(params: string[] = [], name: string, value?: any) {
        // add name
        const argumentName = `--${camelToDash(name)}`;
        params.push(argumentName);

        if (value) {
            // add value
            if (Array.isArray(value) && value.length > 0) {
                params.push(value.join(", "));
            } else {
                if (typeof value === "string") {
                    const quotedValue = `"${value.replace("&", "^&")}"`;
                    params.push(quotedValue);

                } else if (typeof value === "number") {
                    params.push(value.toString());

                } else if (typeof value === "object") {
                    const quotedValue = `"${escapeQuotes(JSON.stringify(value).replace("&", "^&"))}"`;
                    params.push(quotedValue);

                } else {
                    // do nothing
                }
            }
        }
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
