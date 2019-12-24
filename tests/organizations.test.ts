import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

describe("gcloud organizations", () => {
    it("full test", async () => {
        const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME).init();
        const organizations = gcloud.organizations();
        const help = await organizations.help();
        const list = await organizations.list();
        for (const item of list) {
            const describe = await organizations.describe(item.id);
            console.log(describe);
        }
    });
});
