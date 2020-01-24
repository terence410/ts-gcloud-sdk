import {config} from "dotenv";
config();
import "mocha";
import {GcloudSdk} from "../src/GcloudSdk";

describe("gcloud projects", () => {
    it("full test", async () => {
        const options = {keyFilename: process.env.KEY_FILENAME};
        const gcloud = await new GcloudSdk(process.env.GCP_PROJECT_NAME, options).init();
        const datastore = gcloud.datastore();
        const value = Math.random();
        const exportUrl = `gs://datastore-11223344/directory-${value}/`;
        const importUrl = `gs://datastore-11223344/directory-${value}/directory-${value}.overall_export_metadata`;
        const kinds = ["errorTest"];
        await datastore.export(exportUrl, {kinds, namespaces: ["testing"]});
        await datastore.import(importUrl);

        // indexes
        const datastoreIndexes = datastore.indexes();
        const listResult = await datastoreIndexes.list();
        const createResult = await datastoreIndexes.create("./index.yaml");
        const cleanupResult = await datastoreIndexes.cleanup("./index.yaml");
    });
});

// Create dataset in BQ
// bq mk -f my-project:datastore_backup_`date -u +"%Y%m%d"`

// Load the kind(s) data from GCS to BQ
// bq load --project_id my-project --source_format=DATASTORE_BACKUP my-project:datastore-backup_`date -u +"%Y%m%d"`.KIND1 gs://my_bucket/datastore-backup-`date -u +"%Y%m%d"`/all_namespaces/kind_KIND1/all_namespaces_kind_KIND1.export_metadata

// Clear GCS after importing
// gsutil -m rm -r gs://my_bucket/datastore-backup-`date -u +"%Y%m%d"`
