import {config} from "dotenv";
config();
import { assert, expect } from "chai";
import "mocha";
import {BigQueryCommandHelper} from "../src/helpers/BigQueryCommandHelper";
import {GsutilCommandHelper} from "../src/helpers/GsutilCommandHelper";

describe("big query helper", () => {
    it("general", async () => {
        const bigQuery = new BigQueryCommandHelper();
        bigQuery.addArgument({help: ""});
        const result = await bigQuery.exec();
        console.log(result);
    });
});
