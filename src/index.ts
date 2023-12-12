import {
  CronController,
  QueueController,
  EmailMessageController,
  FetchController,
} from './controller';

export default {
  fetch: FetchController.init,
  email: EmailMessageController.init,
  scheduled: CronController.init,
  queue: QueueController.init,
};
