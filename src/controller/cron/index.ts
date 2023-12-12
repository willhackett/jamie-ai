import { CheckRun } from '@/job/check-run';
import { D1, and, lte, schema } from '@/service/d1';
import { OpenAiClient } from '@/service/openai';
import { Env } from '@/types';

class CronController {
  protected d1: D1;
  protected openAiClient: OpenAiClient;
  protected checkRun: CheckRun;

  public static init(event: ScheduledEvent, env: Env) {
    const controller = new CronController(env);

    return controller.run();
  }

  constructor(protected env: Env) {
    this.d1 = new D1(env.DB);
    this.openAiClient = new OpenAiClient(env);

    this.checkRun = new CheckRun(this.d1, this.openAiClient, this.env.QUEUE);
  }

  public async run() {
    // Check the status of runs
    await this.checkRun.run();
  }
}

export { CronController };
