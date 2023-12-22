import { ScheduleModel } from '@/model';
import { D1 } from '@/service/d1';
import { WakeSchedule } from './wake-schedule';

class CheckSchedule {
  protected scheduleModel: ScheduleModel;

  constructor(protected d1: D1, protected queue: Queue) {
    this.scheduleModel = new ScheduleModel(this.d1);
  }

  public async run() {
    const jobs = await this.scheduleModel.getJobs();

    for (const job of jobs) {
      await this.scheduleModel.deleteJob(job.id);

      if (!job.user.threadId) {
        continue;
      }

      await this.queue.send(WakeSchedule.parcel(job.user.threadId, job.userId));
    }
  }
}

export { CheckSchedule };
