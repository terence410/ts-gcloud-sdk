import Debug from "debug";
import YAML from "yaml";
import {IProjectOptions} from "./GcloudSdk";
import {GcloudCommandHelper} from "./helpers/GcloudCommandHelper";
import {camelToDotCapitalize, camelToSnakeCapitalize, camelToSnakeCapitalizeWithoutUnderscore} from "./utils";

const debug = Debug("gcloud");
const sdkPath = process.env.GCP_SDK_PATH || "gcloud";
type ParseTableOptions = {
    isSplitBySpace?: boolean,
    contentOffset?: number,
};

export class GcloudBase {
    public commandPrefix: string = "";

    constructor( public readonly project: string, public projectOptions: Partial<IProjectOptions>) {
    }

    public extend<T extends typeof GcloudBase>(productType: T): InstanceType<T> {
        return new productType(this.project, this.projectOptions) as InstanceType<T>;
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

    protected _parseYaml(yaml: string) {
        return YAML.parse(yaml);
    }

    protected _parseTable(table: string, headers?: string[], options: ParseTableOptions = {}) {
        const contentOffset = options.contentOffset || 0;
        const rows = table.trimRight().split(/\r?\n/).slice(contentOffset);
        let list: any[] = [];

        if (rows.length) {
            if (headers) {
                const headerRow = rows[0];
                const indexes: number[] = [];
                for (const header of headers) {
                    const tryHeaders = [
                        camelToSnakeCapitalize(header),
                        camelToSnakeCapitalizeWithoutUnderscore(header),
                        camelToDotCapitalize(header),
                    ];

                    let tryIndex = -1;
                    for (const tryHeader of tryHeaders) {
                        tryIndex = headerRow.indexOf(tryHeader);
                        if (tryIndex >= 0) {
                            break;
                        }
                    }

                    indexes.push(tryIndex);
                }

                // if we found header
                if (indexes.some(x => x >= 0)) {
                    for (const line of rows.slice(1)) {
                        const listResult: any = {};
                        if (options.isSplitBySpace) {
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
                }
            } else {
                list = rows.slice(1);
            }
        }

        return list;
    }

    // endregion

}
