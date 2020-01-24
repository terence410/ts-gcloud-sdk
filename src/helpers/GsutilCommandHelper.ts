import * as path from "path";
import {CommandHelper} from "./CommandHelper";

let sdkPath = process.env.GCP_GSUTIL_PATH || "gsutil";
if (path.isAbsolute(sdkPath)) {
    sdkPath = `"${sdkPath}"`;
}

export class GsutilCommandHelper extends CommandHelper {
    constructor(execOptions = {}) {
        super(sdkPath, execOptions);
    }
}
