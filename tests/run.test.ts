import {config} from "dotenv";
config();
import "mocha";
import {Gcloud} from "../src";
import {IGkeArgv, IManagedArgv} from "../src/GcloudRun";
import {GcloudSdk, IProjectOptions} from "../src/GcloudSdk";

const projectId = process.env.GCP_PROJECT_NAME;
const options: Partial<IProjectOptions> = {clientEmail: process.env.GCP_CLIENT_EMAIL, cwd: "./tests/run", beta: true};
const gcloudSDK = new GcloudSdk(projectId, options);
let gcloud!: Gcloud;

describe("gcloud run", () => {
    it("setup", async () => {
        gcloud = await gcloudSDK.init();
    });

    it("deploy managed service", async () => {
        const serviceName = "managed";
        const run = gcloud.run();
        const builds = gcloud.builds();
        const platform = "managed";
        const image = `gcr.io/${projectId}/managed`;
        const region = gcloud.regions.asiaEast1;

        const buildList = await builds.list({filter: `images:${image}`});
        for (const buildItem of buildList) {
            const buildDescribe = await builds.describe(buildItem.id);
        }

        // create one if not exist
        if (!buildList.length) {
            await builds.submit({tag: image, timeout: "120s"});
        }

        // deploy
        await run.deploy(serviceName, {
            allowUnauthenticated: true,
            image,
            platform: "managed",
            region,
            setEnvVars: {FOO: "foo", BAR: "bar"},
            labels: {name: "testing"},
            memory: run.memory.M128,
            concurrency: 100,
            maxInstances: 50,
            // setSecrets: {
            //     TEST_ONE: "SECRET_ONE:latest",
            //     TEST_TWO: "SECRET_TWO:latest"
            // },
            // serviceAccount: process.env.GCP_CLIENT_EMAIL,
        });

        const argv: IManagedArgv = {platform, region};

        // list revisions
        const runRevisionList = await run.revisions().listManaged({...argv, service: serviceName});
        console.log("runRevisionList", runRevisionList);

        // remove if we have have too many revisions
        runRevisionList.sort((a, b) => new Date(b.deployed).getTime() - new Date(a.deployed).getTime());
        for (const runRevisionItem of runRevisionList) {
            if (!runRevisionItem.active) {
                await run.revisions().deleteManaged(runRevisionItem.revision, argv);
            }
        }

        // list existing services
        const runServiceList = await run.services().listManaged({...argv, filter: `SERVICE:${serviceName}`});
        console.log("runServiceList", runServiceList);

        for (const runServiceItem of runServiceList) {
            const runServiceDescribe = await run.services().describeManaged(runServiceItem.service, argv);
            await run.services().deleteManaged(serviceName, argv);
        }
    });

    it("deploy gke (Anthos)", async () => {
        const run = gcloud.run();
        const container = gcloud.container();
        const builds = gcloud.builds();
        const platform = "gke";
        const clusterName = "cluster";
        const image = `gcr.io/${projectId}/gke`;
        const zone = gcloud.zones.usCentral1a;
        const serviceName = "gke-service";
        const namespace = "kube-public";

        // install components
        if (process.platform !== "win32") {
            await gcloud.components().install("kubectl");

            // enable all services
            await gcloud.services().enable("container.googleapis.com");
            await gcloud.services().enable("containerregistry.googleapis.com");
            await gcloud.services().enable("cloudbuild.googleapis.com");
        }

        const clusterList = await container.clusters().list();
        for (const clusterItem of clusterList) {
            const clusterDescribe = await container.clusters().describe(clusterItem.name, {zone});
        }
        const existCluster = clusterList.find(x => x.name === clusterName);

        // create cluster
        if (!existCluster) {
            await container.clusters().create(clusterName, {
                addons: "HorizontalPodAutoscaling,HttpLoadBalancing,CloudRun",
                machineType: container.machineTypes.n1Standard4,
                enableStackdriverKubernetes: true,
                zone,
                scopes: "cloud-platform",
            });
        }

        // submit build
        const buildList = await builds.list({filter: `images:${image}`});
        for (const buildItem of buildList) {
            const buildDescribe = await builds.describe(buildItem.id);
        }

        // create one if not exist
        if (!buildList.length) {
            await builds.submit({tag: image, timeout: "120s"});
        }

        // deploy service
        await run.deploy(serviceName, {
            image,
            platform,
            namespace: "kube-public",
            cluster: clusterName,
            clusterLocation: zone,
            setEnvVars: {FOO: "foo", BAR: "bar"},
        });

        // services
        const argv: IGkeArgv = {
            platform,
            namespace,
            cluster: clusterName,
            clusterLocation: zone,
        };

        // revisions
        const runRevisionList = await run.revisions().listGke({service: serviceName, ...argv});
        console.log("runRevisionList", runRevisionList);

        const runServiceList = await run.services().listGke(argv);
        console.log("runServiceList", runServiceList);

        // delete
        for (const runServiceItem of runServiceList) {
            const runServiceDescribe = await run.services().describeGke(runServiceItem.service, argv);
            await run.services().deleteGke(serviceName, argv);
        }
    });

    it("delete cluster", async () => {
        const clusterName = "cluster";
        const zone = gcloud.zones.usCentral1a;
        const container = gcloud.container();
        await container.clusters().delete(clusterName, {zone});
    });
});