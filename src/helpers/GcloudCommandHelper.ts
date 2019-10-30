import * as configs from "../enums/configs";
import {ChildProcessHelper, IInteractive} from "./ChildProcessHelper";

export class GcloudCommandHelper {
    public commanderHelper: ChildProcessHelper;
    constructor(params: string[] = [], execOptions: any = {}) {
        this.commanderHelper = new ChildProcessHelper(configs.commandPath, params, execOptions);
    }

    public async exec(): Promise<string> {
        const result = await this.commanderHelper.exec();
        return result.stdout || result.stderr;
    }

    public async execInteractive(interactives: IInteractive[], initStdin?: string): Promise<string> {
        const result = await this.commanderHelper.execInteractive(interactives, initStdin);
        return result.stdout || result.stderr;
    }
}
