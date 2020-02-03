import {httpMethods} from "./enums/httpMethods";
import {regions} from "./enums/regions";
import {timeZones} from "./enums/timeZones";
import {GcloudApp} from "./GcloudApp";
import {GcloudDatastore} from "./GcloudDatastore";
import {GcloudFunctions} from "./GcloudFunctions";
import {GcloudLogging} from "./GcloudLogging";
import {GcloudOrganizations} from "./GcloudOrganizations";
import {GcloudProjects} from "./GcloudProjects";
import {GcloudSchedulerJobs} from "./GcloudSchedulerJobs";
import {IProjectOptions} from "./GcloudSdk";

export class Gcloud {
    public regions = regions;
    public timeZones = timeZones;
    public httpMethods = httpMethods;

    constructor(public readonly project: string, private _options: Partial<IProjectOptions> = {}) {

    }

    public functions() {
        return new GcloudFunctions("functions", this.project, this._options);
    }

    public organizations() {
        return new GcloudOrganizations( "organizations", this.project, this._options);
    }

    public projects() {
        return new GcloudProjects("projects", this.project, this._options);
    }

    public app() {
        return new GcloudApp("app", this.project, this._options);
    }

    public logging() {
        return new GcloudLogging("logging", this.project, this._options);
    }

    public schedulerJobs() {
        return new GcloudSchedulerJobs("scheduler jobs", this.project, this._options);
    }

    public datastore() {
        return new GcloudDatastore("datastore", this.project, this._options);
    }
}
