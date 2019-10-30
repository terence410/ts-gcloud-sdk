import * as child_process from "child_process";
import Debug from "debug";

export type IInteractive = {
    match: string | RegExp;
    respond: string;
};

const debug = Debug("gcloud");

export class ChildProcessHelper {
    private _execOptions: object;

    constructor(public command: string, public params: string[] = [], execOptions = {}) {
        this._execOptions = Object.assign({
            shell: true,
            cwd: process.cwd(),
        }, execOptions);
    }

    public async exec(): Promise<{stdout: string, stderr: string}> {
        const command = `${this.command} ${this.params.join(" ")}`;
        debug("exec", command);

        const output = await new Promise<any>((resolve, reject) => {
            child_process.exec(command, this._execOptions,
                (err: any, stdout: string, stderr: string) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve({stdout, stderr});
                });
        });

        return output;
    }

    public async execInteractive(interactives: IInteractive[], initStdin?: string):
        Promise<{stdout: string, stderr: string}> {
        const output = await new Promise<any>((resolve, reject) => {
            let stdout = "";
            let stderr = "";

            const command = `${this.command} ${this.params.join(" ")}`;
            debug("execInteractive", command);
            const spawn = child_process.spawn(command, [], this._execOptions);

            // if we need to pass something to stdin first
            spawn.stdin.setDefaultEncoding("utf8");
            if (initStdin !== undefined ) {
                spawn.stdin.write(initStdin);
            }

            spawn.stdout.setEncoding("utf8");
            spawn.stdout.on("data", (data) => {
                stdout += data;
                debug("execInteractive:stdout", data);

                for (const interactive of interactives) {
                    if (data.match(interactive.match)) {
                        const respond = interactive.respond + (interactive.respond.match(/\r?\n/)  ? "" : "\n");
                        spawn.stdin.write(respond);
                    }
                }
            });

            spawn.stderr.setEncoding("utf8");
            spawn.stderr.on("data", (data) => {
                debug("execInteractive:stderr", data);
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
