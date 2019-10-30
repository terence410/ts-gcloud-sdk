import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

describe("gcloud scheduler jobs", () => {
    it("full test", async () => {
        const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME).init();
        const schedulerJobs = gcloud.schedulerJobs();

        const help = await schedulerJobs.help();
        // console.log("help", help);

        const jobId = "testing";
        const list = await schedulerJobs.list();
        for (const item of list) {
            if (item.id === jobId) {
                await schedulerJobs.pause(item.id);
                await schedulerJobs.resume(item.id);
            }
        }

        const argv = {
            schedule: "* * * * *",
            uri: "https://www.google.com/?a=1&b=2",
            timeZone: gcloud.timeZones.Asia_HongKong,
            httpMethod: gcloud.httpMethods.post,
            maxRetryAttempts: 2,
            messageBody: "nothing",
        };

        // create or update
        await schedulerJobs.createOrUpdateHttp(jobId, argv);

        // further create or update
        await schedulerJobs.createOrUpdateHttp(jobId, argv);

        // delete it
        await schedulerJobs.delete(jobId);

        // describe
        const describe = await schedulerJobs.describe(jobId);
        if (describe) {
            const updateHttp = await schedulerJobs.updateHttp(jobId, argv);
        } else {
            const createHttp = await schedulerJobs.createHttp(jobId, argv);
        }

        // delete it
        await schedulerJobs.delete(jobId);
    });
});
