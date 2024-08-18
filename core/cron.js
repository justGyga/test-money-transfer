import { CronJob } from "cron";
import { BaseModule } from "./server.js";

export default class Scheduler extends BaseModule {
    #jobs;
    constructor(jobs) {
        super();
        this.#jobs = jobs;
    }

    async handler() {
        this.#jobs.forEach(({ time, job }) => new CronJob(time, job).start());
        console.log("[Cron] Scheduler is running");
    }
}
