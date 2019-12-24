import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

describe("gcloud projects", () => {
    it("full test", async () => {
        const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME).init();
        const datastore = gcloud.datastore();
        const help = await datastore.help();
        const listResult = await datastore.listIndexes();
        const createResult = await datastore.createIndexes("./index.yaml");
        const cleanupResult = await datastore.cleanupIndexes("./index.yaml");
    });
});
