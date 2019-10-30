# ts-gcloud-sdk

Google Cloud SDK functional wrapper written in TypeScript. Useful for automation and integration.

# Settings
- If your sdk it not added to path, you can specific the env variable to point to the path directly
  - export GCP_SDK_PATH=gcloud  

# Example Usage

```typescript

import {GcloudSdk} from "./src";

async function main() {
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

```
