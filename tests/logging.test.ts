import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

describe("gcloud logging", () => {
    it("full test", async () => {
        const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME).init();
        const logging = gcloud.logging();

        const help = await logging.help();
        // console.log("help", help);

        const list = await logging.listLogs();
        console.log(list);

        const resourcesDescriptors = await logging.resourceDescriptors();
        console.log(resourcesDescriptors);

        const write = await logging.write("mytype", "testing");
        console.log(write);

        const readList = await logging.read({"resource.type": "global"}, {});
        console.log(readList);
    });
});
