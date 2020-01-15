import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

describe("gcloud projects", () => {
    it("full test", async () => {
        const options = {keyFilename: process.env.KEY_FILENAME};
        const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME, options).init();
        const datastore = gcloud.datastore();
        const datastoreIndexes = datastore.indexes();
        const listResult = await datastoreIndexes.listIndexes();
        const createResult = await datastoreIndexes.createIndexes("./index.yaml");
        const cleanupResult = await datastoreIndexes.cleanupIndexes("./index.yaml");
    });
});
