import {httpMethods} from "./enums/httpMethods";
import {regions} from "./enums/regions";
import {timeZones} from "./enums/timeZones";
import {zones} from "./enums/zones";
import {GcloudApp} from "./GcloudApp";
import {GcloudAuth} from "./GcloudAuth";
import {GcloudBase} from "./GcloudBase";
import {GcloudBuilds} from "./GcloudBuilds";
import {GcloudComponents} from "./GcloudComponents";
import {GcloudContainer} from "./GcloudContainer";
import {GcloudDatastore} from "./GcloudDatastore";
import {GcloudFunctions} from "./GcloudFunctions";
import {GcloudLogging} from "./GcloudLogging";
import {GcloudOrganizations} from "./GcloudOrganizations";
import {GcloudProjects} from "./GcloudProjects";
import {GcloudRun} from "./GcloudRun";
import {GcloudSchedulerJobs} from "./GcloudSchedulerJobs";
import {IProjectOptions} from "./GcloudSdk";
import {GcloudServices} from "./GcloudServices";

export class Gcloud {
    public regions = regions;
    public zones = zones;
    public timeZones = timeZones;
    public httpMethods = httpMethods;

    constructor(public readonly project: string, public projectOptions: Partial<IProjectOptions> = {}) {

    }

    public extend<T extends typeof GcloudBase>(productType: T): InstanceType<T> {
        return new productType(this.project, this.projectOptions) as InstanceType<T>;
    }

    public app() {
        return this.extend(GcloudApp);
    }

    public auth() {
        return this.extend(GcloudAuth);
    }

    public builds() {
        return this.extend(GcloudBuilds);
    }

    public components() {
        return this.extend(GcloudComponents);
    }
    public container() {
        return this.extend(GcloudContainer);
    }

    public datastore() {
        return this.extend(GcloudDatastore);
    }

    public functions() {
        return this.extend(GcloudFunctions);
    }

    public logging() {
        return this.extend(GcloudLogging);
    }

    public organizations() {
        return this.extend(GcloudOrganizations);
    }

    public projects() {
        return this.extend(GcloudProjects);
    }

    public run() {
        return this.extend(GcloudRun);
    }

    public schedulerJobs() {
        return this.extend(GcloudSchedulerJobs);
    }

    public services() {
        return this.extend(GcloudServices);
    }
}
