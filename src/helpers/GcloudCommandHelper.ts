import * as path from "path";
import {CommandHelper} from "./CommandHelper";

let sdkPath = process.env.GCP_SDK_PATH || "gcloud";
if (path.isAbsolute(sdkPath)) {
    sdkPath = `"${sdkPath}"`;
}

export class GcloudCommandHelper extends CommandHelper {
    constructor(execOptions = {}) {
        super(sdkPath, execOptions);
    }
}
