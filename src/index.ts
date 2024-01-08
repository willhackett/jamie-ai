import { CronController, QueueController, FetchController } from './controller';

export default {
  fetch: FetchController.init,
  scheduled: CronController.init,
  queue: QueueController.init,
};
