import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

const options = {clientEmail: process.env.GCP_CLIENT_EMAIL, cwd: "./tests/app"};
const gcloudSdk = new GcloudSdk(process.env.GCP_PROJECT_NAME, options);
const serviceName = "testing";

describe("gcloud app", () => {
    it("full test", async () => {
        const gcloud = await gcloudSdk.init();
        const app = gcloud.app();

        // help
        const help = await app.help();
        const regions = await app.regions();

        try {
            const create = await app.create({region: gcloud.regions.asiaEast2});
        } catch (err) {
            // ignore error
        }

        // remove existing services
        try {
            await await app.services().delete(serviceName);
        } catch (err) {
            // ignore error
        }

        // deploy two versions
        const deploy1 = await app.deploy({version: "v1"});
        const deploy2 = await app.deploy({version: "v2"});

        const describe = await app.describe();
        console.log("describe", describe);

        const domainMappingsList = await app.domainMappings().list();
        console.log("domainMappingsList ", domainMappingsList);

        const firewallRulesList = await app.firewallRules().list();
        console.log("firewallRulesList", firewallRulesList);

        const services = app.services();
        const serviceList = await services.list();
        for (const serviceItem of serviceList) {
            const serviceDescribe = await services.describe(serviceItem.service);
            console.log(serviceItem);
            console.log(serviceDescribe);
        }

        // split traffic
        await app.services().setTraffic(serviceName, {splits: "v1=.5,v2=.5"});

        // list instances of services, delete it
        const list = await app.instances().list();
        for (const item of list) {
            const instanceDescribe = await app
                .instances()
                .describe(item.id, {service: item.service, version: item.version});

            if (item.service === serviceName) {
                await app.instances().delete(item.id, {service: item.service, version: item.version});
            }
        }

        // this will create a new instances
        const browse = await app.browse({service: serviceName});
        console.log("browse", browse);

        // remove all versions
        const versionList =  await app.versions().list({service: serviceName});
        for (const versionItem of versionList) {
            const versionDescribe = await app.versions().describe(versionItem.versionId, {service: versionItem.service});
        }

        // delete service
        await app.services().delete(serviceName);
    });
});
