import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";
import {ChildProcessHelper} from "../src/helpers/ChildProcessHelper";

describe("general", () => {
    it("command helper", async () => {
        const commandHelper = new ChildProcessHelper("del", ["/p", "testing.txt"]);
        const result = await commandHelper.execInteractive([{match: /Delete \(Y\/N\)/, respond: "Y"}]);
    });

    it("login with service account", async () => {
        // open a new session
        const gcloudSdk = new GcloudSdk(process.env.GCP_PROJECT_NAME, {keyFilename: process.env.KEY_FILENAME});
        const gcloud = await gcloudSdk.init();
    });

    it("login with interactive", async () => {
        const gcloudSdk = new GcloudSdk(process.env.GCP_PROJECT_NAME);
        await gcloudSdk.logout();
        const gcloud = await gcloudSdk.init();
    });
});
