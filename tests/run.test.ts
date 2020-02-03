import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

describe("gcloud run", () => {
    it("full test", async () => {
        const projectId = process.env.GCP_PROJECT_NAME;
        const options = {clientEmail: process.env.GCP_CLIENT_EMAIL, cwd: "./tests/run"};
        const gcloud = await new GcloudSdk(projectId, options).init();
        const run = gcloud.run();
        const builds = gcloud.builds();
        const region = gcloud.regions.asiaEast1;
        const platform = "managed";
        const tag = `gcr.io/${projectId}/testing`;
        const serviceName = "testing";

        const buildList = await builds.list();
        // console.log("buildList", buildList);
        for (const buildItem of buildList) {
            // const buildDescribe = await builds.describe(buildItem.id);
            // const buildLog = await builds.log(buildItem.id);
            // console.log("buildDescribe", buildDescribe);
            // console.log("buildLog", buildLog);
        }

        // await builds.submit({tag, timeout: "120s"});

        // deploy
        await run.deploy(serviceName, {
            allowUnauthenticated: true,
            image: tag,
            platform: "managed",
            region,
            setEnvVars: {FOO: "foo", BAR: "bar"},
        });

        // services
        const runServiceList = await run.services().list({region, platform});
        console.log("runServiceList", runServiceList);

        // revisions
        const runRevisionList = await run.revisions().list({region, platform});
        console.log("runRevisionList", runRevisionList);

        // delete
        // await run.services().delete(serviceName, {region, platform});
    });
});
