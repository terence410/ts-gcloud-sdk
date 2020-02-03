import {httpMethods} from "./enums/httpMethods";
import {regions} from "./enums/regions";
import {timeZones} from "./enums/timeZones";
import {GcloudApp} from "./GcloudApp";
import {GcloudBase} from "./GcloudBase";
import {GcloudBuilds} from "./GcloudBuilds";
import {GcloudDatastore} from "./GcloudDatastore";
import {GcloudFunctions} from "./GcloudFunctions";
import {GcloudLogging} from "./GcloudLogging";
import {GcloudOrganizations} from "./GcloudOrganizations";
import {GcloudProjects} from "./GcloudProjects";
import {GcloudRun} from "./GcloudRun";
import {GcloudRunDomainMappings} from "./GCloudRun/GcloudRunDomainMappings";
import {GcloudSchedulerJobs} from "./GcloudSchedulerJobs";
import {IProjectOptions} from "./GcloudSdk";
import Instance = WebAssembly.Instance;

export class Gcloud {
    public regions = regions;
    public timeZones = timeZones;
    public httpMethods = httpMethods;

    constructor(public readonly project: string, public projectOptions: Partial<IProjectOptions> = {}) {

    }

    public extend<T extends typeof GcloudBase>(productType: T): InstanceType<T> {
        return new productType(this.project, this.projectOptions) as InstanceType<T>;
    }

    public builds() {
        return this.extend(GcloudBuilds);
    }

    public functions() {
        return this.extend(GcloudFunctions);
    }

    public organizations() {
        return this.extend(GcloudOrganizations);
    }

    public projects() {
        return this.extend(GcloudProjects);
    }

    public app() {
        return this.extend(GcloudApp);
    }

    public run() {
        return this.extend(GcloudRun);
    }

    public logging() {
        return this.extend(GcloudLogging);
    }

    public schedulerJobs() {
        return this.extend(GcloudSchedulerJobs);
    }

    public datastore() {
        return this.extend(GcloudDatastore);
    }
}
