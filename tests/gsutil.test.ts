import {config} from "dotenv";
config();
import { assert, expect } from "chai";
import "mocha";
import {GsutilCommandHelper} from "../src/helpers/GsutilCommandHelper";

describe("gsutil helper", () => {
    it("general command", async () => {
        const gsutil = new GsutilCommandHelper();
        gsutil.addParams(["help", "rm"]);
        gsutil.addArgument({q: ""});
        const result = await gsutil.exec();
        console.log(result);
    });
});
