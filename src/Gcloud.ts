import {httpMethods} from "./enums/httpMethods";
import {regions} from "./enums/regions";
import {timeZones} from "./enums/timeZones";
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

    constructor(public readonly project: string, private _options: IProjectOptions = {}) {

    }

    public functions() {
        return new GcloudFunctions(this.project, "functions", this._options);
    }

    public organizations() {
        return new GcloudOrganizations(this.project, "organizations", this._options);
    }

    public projects() {
        return new GcloudProjects(this.project, "projects", this._options);
    }

    public logging() {
        return new GcloudLogging(this.project, "logging", this._options);
    }

    public schedulerJobs() {
        return new GcloudSchedulerJobs(this.project, "scheduler jobs", this._options);
    }
}
