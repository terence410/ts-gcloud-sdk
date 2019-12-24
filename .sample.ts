import {GcloudSdk} from "./src";

async function quickStart() {
    const gcloudSDK = await new GcloudSdk("project-name");
    const help = await gcloudSDK.help();
    const gcloud = gcloudSDK.init();
}

async function cloudFunctions() {
    const gcloud = await new GcloudSdk("project-name").init();
    const functions = gcloud.functions();

    const help = await functions.help();
    const regions = await functions.regions();
    const logs = await functions.logs();
    const eventTypes = await functions.eventTypes();
    const list = await functions.list();
    for (const item of list) {
        const describeResult = await functions.describe(item.name, {region: item.region});
        if (item.status === "READY" || item.status === "ACTIVE") {
            const callResult = await functions.call(item.name, {region: item.region, data: {name: "value"}});
        }
    }

    const name = "helloGET";
    const region = gcloud.regions.usCentral1;
    const deploy = await functions
        .deploy(name, {
            triggerHttp: true,
            entryPoint: "testing",
            runtime: functions.runtimes.nodejs8,
            region,
            memory: functions.memory.M128,
            setEnvVars: "name=gcp",
        });
    await functions.delete(name, {region});
}

async function cloudOrganizations() {
    const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME).init();
    const organizations = gcloud.organizations();
    const list = await organizations.list();
    for (const item of list) {
        const describe = await organizations.describe(item.id);
        console.log(describe);
    }
}

async function cloudDatastore() {
    const gcloud = await new GcloudSdk("project-name").init();
    const datastore = gcloud.datastore();
    const listResult = await datastore.listIndexes();
    const createResult = await datastore.createIndexes("./index.yaml");
    const cleanupResult = await datastore.cleanupIndexes("./index.yaml");
}
