import Debug from "debug";
import * as fs from "fs";
import {Gcloud} from "./Gcloud";
import {ChildProcessHelper} from "./helpers/ChildProcessHelper";

const debug = Debug("gcloud");
const sdkPath = process.env.GCP_SDK_PATH || "gcloud";

export type IProjectOptions = {
    cwd?: string,
    keyFilename?: string,
    clientEmail?: string;
};

export class GcloudSdk {
    constructor(public readonly project: string = "", private _options: IProjectOptions = {}) {
        if (this._options.keyFilename) {
            try {
                const keyJson = JSON.parse(fs.readFileSync(this._options.keyFilename).toString());
                this._options.clientEmail = keyJson.client_email;
            } catch (err) {
                throw new Error(`keyFilename ${this._options.keyFilename} not exist / invalid json format`);
            }
        }
    }

    public async init() {
        this._validateProjectOptions(this._options);

        try {
            await this.help();
        } catch (err) {
            debug(err);
            
            // tslint:disable-next-line:max-line-length
            throw Error( `Google Cloud SDK not installed. Please check if you have added the SDK into the PATH variable.`);
        }

        if (await this.login()) {
            return new Gcloud(this.project, this._options);
        } else {
            throw new Error(`You failed to sign in. Please try again.`);
        }
    }

    public async login(): Promise<boolean> {
        const result = await new ChildProcessHelper(sdkPath, ["auth", "list"]).exec();
        let isSignedIn = false;

        if (/Credentialed Accounts/.test(result.stdout)) {
            const listResults = result.stdout.split("\r\n");
            for (const line of listResults.splice(2)) {
                const matches = line.match(/\*[ ]*(.*)/);
                if (matches && (!this._options.clientEmail || matches[1] === this._options.clientEmail)) {
                    debug(`You already signed in as ${matches[1]}.`);
                    isSignedIn = true;
                }
            }
        }

        if (!isSignedIn) {
            let authResult: string = "";
            if (this._options.keyFilename) {
                debug("Logging in with service account");
                authResult = await this.authWithServiceAccount(this._options.keyFilename);
            } else {
                debug("Please login to Google Cloud");
                authResult = await this.authWithInteractive();
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

    public async authWithInteractive() {
        const result = await new ChildProcessHelper(sdkPath, ["auth", "login"]).exec();
        return result.stderr;
    }

    public async authWithServiceAccount(keyFilename: string) {
        const params = [
            "auth",
            "activate-service-account",
            "--key-file=" + keyFilename,
        ];
        const result = await new ChildProcessHelper(sdkPath, params).exec();
        return result.stderr;
    }

    public async logout() {
        try {
            const result = await new ChildProcessHelper(sdkPath, ["auth", "revoke"]).exec();
            const results = result.stdout.split("\r\n");
            for (const line of results.splice(1)) {
                const matches = line.match(/- (.*)/);
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
        return await new ChildProcessHelper(sdkPath, ["--help"]).exec();
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
