import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

describe("gcloud projects", () => {
    it("full test", async () => {
        const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME).init();
        const projects = gcloud.projects();

        const help = await projects.help();
        // console.log("help", help);

        const list = await projects.list();
        const promises: any[] = [];
        for (const item of list) {
            const promise = projects.describe(item.projectId);
            promises.push(promise);
        }
        
        const result = await Promise.all(promises);
        for (const item of result) {
            console.log(item);
        }
    });
});
