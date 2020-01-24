import * as path from "path";
import {CommandHelper} from "./CommandHelper";

let sdkPath = process.env.GCP_BQ_PATH || "bg";
if (path.isAbsolute(sdkPath)) {
    sdkPath = `"${sdkPath}"`;
}

export class BigQueryCommandHelper extends CommandHelper {
    constructor(execOptions = {}) {
        super(sdkPath, execOptions);
    }
}
