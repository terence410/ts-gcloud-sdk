import Debug from "debug";
import * as fs from "fs";
import {Gcloud} from "./Gcloud";
import {ChildProcessHelper} from "./helpers/ChildProcessHelper";

const debug = Debug("gcloud");
const sdkPath = process.env.GCP_SDK_PATH || "gcloud";

export type IProjectOptions = {
    cwd?: string,
    useExistlogin?: boolean,
    useInteractiveLogin?: boolean,
    keyFilename?: string,
    clientEmail?: string;
};

export class GcloudSdk {
    constructor(public readonly project: string = "", public projectOptions: IProjectOptions = {}) {
        if (this.projectOptions.keyFilename) {
            try {
                const keyJson = JSON.parse(fs.readFileSync(this.projectOptions.keyFilename).toString());
                this.projectOptions.clientEmail = keyJson.client_email;
            } catch (err) {
                throw new Error(`keyFilename ${this.projectOptions.keyFilename} not exist / invalid json format`);
            }
        }
    }

    public async init() {
        this._validateProjectOptions(this.projectOptions);

        try {
            const version = await this.version();
            debug(`gcloud version: ${version}`);
        } catch (err) {
            debug(err);
            
            // tslint:disable-next-line:max-line-length
            throw Error( `Google Cloud SDK not installed. Please check if you have added the SDK into the PATH variable.`);
        }

        if (await this._login()) {
            return new Gcloud(this.project, this.projectOptions);
        } else {
            throw new Error(`There is no authorized user. Please try again.`);
        }
    }

    public async authWithInteractive() {
        const result = await new ChildProcessHelper()
            .addParams(["auth", "login"])
            .exec();
        return result.stderr;
    }

    public async authWithServiceAccount(keyFilename: string) {
        const result = await new ChildProcessHelper()
            .addParams([
                "auth",
                "activate-service-account",
                "--key-file=" + keyFilename,
            ])
            .exec();
        return result.stderr;
    }

    public async logout() {
        try {
            const result = await new ChildProcessHelper()
                .addParams(["auth", "revoke"])
                .exec();
            const results = result.stdout.split("\n");
            for (const line of results.slice(1)) {
                const matches = line.trim().match(/- (.*)/);
                if (matches) {
                    debug(`You are signed out from ${matches[1]}.`);
                }
            }
        } catch (err) {
            debug(err);

            debug(`No account to sign out.`);
        }
    }

    public async help() {
        const result = await new ChildProcessHelper()
            .addArgument({help: "" })
            .exec();
        return result.stdout;
    }

    public async version() {
        const result = await new ChildProcessHelper()
            .addArgument({version: "" })
            .exec();
        return result.stdout;
    }

    private async _login(): Promise<boolean> {
        const result = await new ChildProcessHelper()
            .addParams(["auth", "list"])
            .exec();

        let isSignedIn = false;

        if (/Credentialed Accounts/.test(result.stdout)) {
            const listResults = result.stdout.trim().split("\n");
            for (const line of listResults.slice(2)) {
                const matches = line.trim().match(/\*[ ]*(.*)/);
                debug(`Exist Account: ${line}`);
                if (matches && (this.projectOptions.useExistlogin || matches[1] === this.projectOptions.clientEmail)) {
                    debug(`You already signed in as ${matches[1]}.`);
                    isSignedIn = true;
                    break;
                }
            }
        }

        // we try to sign in using different way
        if (!isSignedIn) {
            let authResult: string = "";
            if (this.projectOptions.keyFilename) {
                debug("Logging in with service account");
                authResult = await this.authWithServiceAccount(this.projectOptions.keyFilename);
            } else {
                if (this.projectOptions.useInteractiveLogin) {
                    debug("Please login to Google Cloud");
                    authResult = await this.authWithInteractive();
                }
            }

            // try to check both stdout/stderr for login data
            const regex = /You are now logged in as \[(.*)\]|service account credentials for: \[(.*)\]/;
            let matches = authResult.match(regex);
            if (!matches) {
                matches = authResult.match(regex);
            }

            if (matches) {
                debug(`You are signed in as ${matches[1] || matches[2]}.`);
                isSignedIn = true;
            }
        }

        return isSignedIn;
    }

    private _validateProjectOptions(options: IProjectOptions) {
        if (options.cwd) {
            try {
                const result = fs.statSync(options.cwd);
            } catch (err) {
                if (err.code === "ENOENT") {
                    throw Error(`Directory ${options.cwd} doest not exist.`);
                } else {
                    debug(err);
                    throw err;
                }
            }
        }
    }
}
