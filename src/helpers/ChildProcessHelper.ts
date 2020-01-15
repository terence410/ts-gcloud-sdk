import * as child_process from "child_process";
import Debug from "debug";
import * as path from "path";
import {camelToDash, escapeQuotes} from "../utils";
const debug = Debug("gcloud");

export type IInteractive = {
    match: string | RegExp;
    respond: string;
};

let sdkPath = process.env.GCP_SDK_PATH || "gcloud";
if (path.isAbsolute(sdkPath)) {
    sdkPath = `"${sdkPath}"`;
}

export class ChildProcessHelper {
    public params: string[] = [];
    public arguments: string[] = [];
    public execOptions: object;

    constructor(execOptions = {}) {
        this.execOptions = Object.assign({
            shell: true,
            cwd: process.cwd(),
        }, execOptions);
    }

    public addParams(params: string[]) {
        for (const param of params) {
            this.params.push(param);
        }

        return this;
    }

    public addArgument(argument: {[key: string]: any}) {
        for (const [name, value] of Object.entries(argument)) {
            const argumentName = `--${camelToDash(name)}`;
            this.arguments.push(argumentName);

            if (value) {
                // add value
                if (Array.isArray(value) && value.length > 0) {
                    this.arguments.push(value.join(", "));
                } else {
                    if (typeof value === "string") {
                        const quotedValue = `"${value.replace("&", "^&")}"`;
                        this.arguments.push(quotedValue);

                    } else if (typeof value === "number") {
                        this.arguments.push(value.toString());

                    } else if (typeof value === "object") {
                        const quotedValue = `"${escapeQuotes(JSON.stringify(value).replace("&", "^&"))}"`;
                        this.arguments.push(quotedValue);

                    } else {
                        // do nothing
                    }
                }
            }
        }

        return this;
    }

    public async exec(): Promise<{stdout: string, stderr: string}> {
        const command = `${sdkPath} ${this.params.concat(...this.arguments).join(" ")}`;
        debug("exec", command);

        const output = await new Promise<any>((resolve, reject) => {
            child_process.exec(command, this.execOptions,
                (err: any, stdout: string, stderr: string) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve({stdout, stderr});
                });
        });

        return output;
    }

    // no use yet
    public async execInteractive(interactives: IInteractive[],
                                 options: { initStdin?: string, sendNewLineOnStderr?: boolean } = {}):
        Promise<{ stdout: string, stderr: string }> {

        const output = await new Promise<any>((resolve, reject) => {
            let stdout = "";
            let stderr = "";

            const command = `${sdkPath} ${this.params.join(" ")} ${this.arguments.join(" ")}`;
            debug("execInteractive", command);
            const spawn = child_process.spawn(command, [], this.execOptions);

            // if we need to pass something to stdin first
            spawn.stdin.setDefaultEncoding("utf8");
            if (options.initStdin !== undefined) {
                spawn.stdin.write(options.initStdin);
            }

            // stdout
            spawn.stdout.setEncoding("utf8");
            spawn.stdout.on("data", (data) => {
                stdout += data;
                debug("execInteractive:stdout", data);
                for (const interactive of interactives) {
                    if (data.match(interactive.match)) {
                        const respond = interactive.respond + (interactive.respond.match(/\r?\n/) ? "" : "\n");
                        spawn.stdin.write(respond);
                    }
                }
            });

            // stderr
            spawn.stderr.setEncoding("utf8");
            spawn.stderr.on("data", (data) => {
                debug("execInteractive:stderr", data);
                if (options.sendNewLineOnStderr) {
                    spawn.stdin.write("\n");
                }
                stderr += data;
            });

            // we only listen to close stream is enough
            spawn.once("close", (code) => {
                spawn.stdout.removeAllListeners();
                spawn.stderr.removeAllListeners();
                spawn.removeAllListeners();
                resolve({stdout, stderr});
            });

            spawn.on("error", (err) => {
                // do nothing
            });

            spawn.on("exit", (code) => {
                // do nothing
            });
        });

        return output;
    }
}
