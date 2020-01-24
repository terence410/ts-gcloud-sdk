import {config} from "dotenv";
config();
import { assert, expect } from "chai";
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

describe("general", () => {
    it("login with service account", async () => {
        // open a new session
        const gcloudSdk = new GcloudSdk(process.env.GCP_PROJECT_NAME, {keyFilename: process.env.KEY_FILENAME});
        await gcloudSdk.logout();
        const gcloud = await gcloudSdk.init();
    });

    it("login with interactive", async () => {
        const gcloudSdk = new GcloudSdk(process.env.GCP_PROJECT_NAME);
        await gcloudSdk.logout();
        const gcloud = await gcloudSdk.init();
    });

    it("logout with interactive", async () => {
        const gcloudSdk = new GcloudSdk(process.env.GCP_PROJECT_NAME, {useInteractiveLogin: false});
        await gcloudSdk.logout();

        try {
            await gcloudSdk.init();
            assert.isTrue(false);
        } catch (err) {
            assert.match(err.message, /There is no authorized user./);
        }
    });
});
