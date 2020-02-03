import {verify} from "crypto";
import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

describe("gcloud app", () => {
    it("full test", async () => {
        const options = {clientEmail: process.env.GCP_CLIENT_EMAIL, cwd: "./tests/app"};
        const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME, options).init();
        const app = gcloud.app();
        const serviceName = "testing";

        // help
        const help = await app.help();
        const regions = await app.regions();

        try {
            const create = await app.create({region: gcloud.regions.asiaEast2});
            console.log("create", create);
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
        const servicesList = await services.list();
        for (const service of servicesList) {
            const serviceDescribe = await services.describe(service.service);
            console.log("services.item", service, serviceDescribe);
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

        const browse = await app.browse({service: serviceName});
        console.log("browse", browse);

        // seems not work
        // const logsTail = await app.logs().tail({service: serviceName});
        // console.log("logs", logsTail);

        // delete service
        await app.services().delete(serviceName);
    });
});
