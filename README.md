# ts-gcloud-sdk

Google Cloud SDK functional wrapper written in TypeScript. Useful for automation and integration.

# Settings
- GCP_SDK_PATH 
  - If your sdk it not added to path, you can specific the env variable to point to the path directly
  - export GCP_SDK_PATH=C:\Program Files\google-cloud-sdk\bin\gcloud
- DEBUG=gcloud
  - show all the logs and commands of the sdk

# Quick Start

```typescript
import {GcloudSdk} from "./ts-gcloud-sdk";
async function quickStart() {
    const gcloudSDK = await new GcloudSdk("project-name");
    const help = await gcloudSDK.help();
    const version = await gcloudSDK.version();
    const gcloud = gcloudSDK.init();

    // make sure the existing gcloud session is same as the clientEmail
    const gcloudSDK1 = await new GcloudSdk("project-name",
        {clientEmail: "abc@example.com"});

    // prompt a web view to login
    const gcloudSDK2 = await new GcloudSdk("project-name", {useInteractiveLogin: true});

    // prompt a web view to login
    const gcloudSDK3 = await new GcloudSdk("project-name", {keyFilename: "serviceAccount.json"});
}
```

# Functions
```typescript
async function functions() {
    const gcloudSDK = await new GcloudSdk("project-name");
    const gcloud = await gcloudSDK.init();
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
```

# Organizations
```typescript
async function cloudOrganizations() {
    const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME).init();
    const organizations = gcloud.organizations();
    const list = await organizations.list();
    for (const item of list) {
        const describe = await organizations.describe(item.id);
        console.log(describe);
    }
}
```

# Datastore
```typescript
async function cloudDatastore() {
    const gcloud = await new GcloudSdk("project-name").init();
    const datastore = gcloud.datastore();
    const datastoreIndexes = datastore.indexes();

    const listResult = await datastoreIndexes.listIndexes();
    const createResult = await datastoreIndexes.createIndexes("./index.yaml");
    const cleanupResult = await datastoreIndexes.cleanupIndexes("./index.yaml");
}
```

# Gsutil Command
```typescript
async function gsutilCommand() {
    const gsutil = new GsutilCommandHelper();
    gsutil.addParams(["help", "rm"]);
    gsutil.addArgument({q: ""});
    const result = await gsutil.exec();
}
```

# Big Query Command
```typescript
async function bigQueryCommand() {
    const bigQuery = new BigQueryCommandHelper();
    bigQuery.addArgument({help: ""});
    const result = await bigQuery.exec();
}
```

# Run with Service Account
- Please grant the below permission if you use service account
  - Cloud Functions Admin
  - Cloud Scheduler Admin
  - Cloud Datastore Owner
  - Service Account User
  - Logging Admin
