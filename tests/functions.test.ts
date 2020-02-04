import { assert, expect } from "chai";
import {config} from "dotenv";
config();
import axios from "axios";
import "mocha";
import * as path from "path";
import {GcloudSdk} from "../src/GcloudSdk";

// variables
const cwd = path.join(process.cwd(), "./tests/functions/");
const options = {cwd, keyFilename: process.env.KEY_FILENAME};

describe("gcloud functions", () => {
    it.only("deploy public functions", async () => {
        const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME, options).init();
        const functions = gcloud.functions();
        const region = gcloud.regions.usCentral1;

        const help = await functions.help();
        // console.log("help", help);

        const regions = await functions.regions();
        console.log("regions", regions);

        const logs = await functions.logs();
        console.log("logs", logs);

        const eventTypes = await functions.eventTypes();
        console.log("eventTypes", eventTypes);

        const list = await functions.list();
        const describe = await functions.describe("unknown", {region});

        for (const item of list) {
            console.log(item);
            const describeResult = await functions.describe(item.name, {region: item.region});
            console.log("describe", item.name, describeResult);

            if (item.status === "READY" || item.status === "ACTIVE") {
                const callResult = await functions.call(item.name, {region: item.region, data: {name: "value"}});
                console.log("call", item.name, callResult);
            }

            console.log("delete", item.name);
        }

        const name = "publicAccess";
        const deploy = await functions
            .deploy(name, {
                triggerHttp: true,
                entryPoint: "testing",
                runtime: functions.runtimes.nodejs8,
                region,
                memory: functions.memory.M128,
                setEnvVars: {name: "gcp", FOO: "foo", BAR: "bar"},
                allowUnauthenticated: true,
            });
        console.log("deploy", deploy);

        const url = deploy.httpsTrigger.url;
        const result2 = await axios.get(url);
        assert.match(result2.data, /Hello World!/);

        // delete it
        await functions.delete(name, {region});
    });

    it("deploy private functions", async () => {
        const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME, options).init();
        const functions = gcloud.functions();
        const auth = gcloud.auth();
        const region = gcloud.regions.usEast1;
        const name = "privateAccess";
        let url = "";
        let account = "";
        let token = "";

        const authList = await auth.list();
        for (const authItem of authList) {
            if (authItem.active) {
                token = await auth.printIdentityToken(authItem.account);
                account = authItem.account;
            }
        }

        const deploy = await functions
            .deploy(name, {
                triggerHttp: true,
                entryPoint: "testing",
                runtime: functions.runtimes.nodejs8,
                region,
                memory: functions.memory.M128,
                setEnvVars: {name: "gcp", FOO: "foo", BAR: "bar"},
                timeout: "60s",
                updateLabels: {name: "functions", type: "private"},
            });
        url = deploy.httpsTrigger.url;

        // allow public access
        // we don't necessary to add ourself, it always work since it's deployer
        await functions.addIamPolicyBinding(name, {region, role: "roles/cloudfunctions.invoker", member: `serviceAccount:${account}`});

        // request again
        const axiosConfig = {headers: {Authorization: `Bearer ${token}`}};
        const result2 = await axios.get(url, axiosConfig);
        assert.match(result2.data, /Hello World!/);

        const iamPolicyList = await functions.getIamPolicy(name, {region});
        for (const binding of iamPolicyList.bindings) {
            for (const member of binding.members) {
                await functions.removeIamPolicyBinding(name, {region, role: binding.role, member});
            }
        }

        // delete it
        await functions.delete(name, {region});
    });
});
