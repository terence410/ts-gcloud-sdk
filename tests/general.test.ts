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

    it("command helper", async () => {
        const gcloudSdk = new GcloudSdk(process.env.GCP_PROJECT_NAME);
        await gcloudSdk.logout();
        const gcloud = await gcloudSdk.init();

        // open a new session
        const gcloudSdk2 = new GcloudSdk(process.env.GCP_PROJECT_NAME);
        const gcloud2 = await gcloudSdk.init();
    });
});
