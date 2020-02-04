import {config} from "dotenv";
config();
import "mocha";
import {Gcloud} from "../src";
import {GcloudSdk} from "../src/GcloudSdk";

const projectId = process.env.GCP_PROJECT_NAME;
const options = {clientEmail: process.env.GCP_CLIENT_EMAIL, cwd: "./tests/run"};
const gcloudSDK = new GcloudSdk(projectId, options);
const managedServiceName = "managed";
let gcloud!: Gcloud;
let region!: string;

describe("gcloud run", () => {
    it("setup", async () => {
        gcloud = await gcloudSDK.init();
        region = gcloud.regions.asiaEast1;
    });

    it("deploy managed service", async () => {
        const run = gcloud.run();
        const builds = gcloud.builds();
        const platform = "managed";
        const image = `gcr.io/${projectId}/managed`;

        const buildList = await builds.list({filter: `images:${image}`});
        for (const buildItem of buildList) {
            const buildDescribe = await builds.describe(buildItem.id);
            console.log("buildDescribe", buildDescribe);
        }

        // create one if not exist
        if (!buildList.length) {
            await builds.submit({tag: image, timeout: "120s"});
        }

        // deploy
        if (false) {
            await run.deploy(managedServiceName, {
                allowUnauthenticated: true,
                image,
                platform: "managed",
                region,
                setEnvVars: {FOO: "foo", BAR: "bar"},
                labels: {name: "testing"},
                memory: run.memory.M128,
                concurrency: 100,
                maxInstances: 50,
            });
        }

        // list revisions
        const runRevisionList = await run.revisions().list({region, platform, service: managedServiceName});
        console.log("runRevisionList", runRevisionList);

        // remove if we have have too many revisions
        runRevisionList.sort((a, b) => new Date(b.deployed).getTime() - new Date(a.deployed).getTime());
        if (runRevisionList.length > 2) {
            for (const runRevisionItem of runRevisionList.slice(2)) {
                if (!runRevisionItem.active) {
                    await run.revisions().delete(runRevisionItem.revision, {region, platform});
                }
            }
        }

        // list existing services
        const runServiceList = await run.services().list({region, platform, filter: `SERVICE:${managedServiceName}`});
        console.log("runServiceList", runServiceList);
    });

    it.skip("deploy anthos", async () => {
        const run = gcloud.run();
        const builds = gcloud.builds();
        const platform = "managed";
        const tag = `gcr.io/${projectId}/testing`;

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
        await run.deploy(managedServiceName, {
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
        await run.services().delete(managedServiceName, {region, platform});
    });

    it.skip("cleanup", async () => {
        const run = gcloud.run();
        const platform = "managed";

        // delete
        await run.services().delete(managedServiceName, {region, platform});
    });
});
