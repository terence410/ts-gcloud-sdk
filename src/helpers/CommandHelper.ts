import * as child_process from "child_process";
import Debug from "debug";
import {camelToDash, escapeQuotes} from "../utils";
const debug = Debug("gcloud");

export type IInteractive = {
    match: string | RegExp;
    respond: string;
};

export class CommandHelper {
    public params: string[] = [];
    public posParams: string[] = [];
    public arguments: string[] = [];
    public execOptions: object;

    constructor(public commandPath: string, execOptions = {}) {
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

    public addPosParams(params: string[]) {
        for (const param of params) {
            this.posParams.push(param);
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
                        let stringValue = value;
                        if (process.platform === "win32") {
                            stringValue = stringValue.replace(/&/g, "^&");
                        }

                        const quotedValue = `"${escapeQuotes(stringValue)}"`;
                        this.arguments.push(quotedValue);

                    } else if (typeof value === "number") {
                        this.arguments.push(value.toString());

                    } else if (typeof value === "object") {
                        const resultValue = Object.entries(value).map(([objectKey, objectValue]) => {
                            if (process.platform === "win32") {
                                objectValue = (objectValue as any).toString().replace(/&/g, "^&");
                            }
                            return `${objectKey}=${escapeQuotes(objectValue as any)}`;
                        }).join(",");
                        this.arguments.push(resultValue);

                    } else {
                        // do nothing
                    }
                }
            }
        }

        return this;
    }

    public async exec(): Promise<{stdout: string, stderr: string}> {
        const command = `${this.commandPath} ${this.params.concat(...this.arguments).concat(...this.posParams).join(" ")}`;
        debug("exec:", command);

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

            const command = `${this.commandPath} ${this.params.join(" ")} ${this.arguments.join(" ")}`;
            debug("execInteractive:", command);
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
