import { Queue } from "bullmq";
import { env } from "../../env";
import { QueueName } from "../queues";
import { createNewRedisInstance, redisQueueRetryOptions } from "./redis";

export class CostTrackEventQueue {
  private static instance: Queue | null = null;

  public static getInstance(): Queue | null {
    if (CostTrackEventQueue.instance) {
      return CostTrackEventQueue.instance;
    }

    const newRedis = createNewRedisInstance({
      enableOfflineQueue: false,
      ...redisQueueRetryOptions,
    });

    CostTrackEventQueue.instance = newRedis
      ? new Queue(QueueName.CostTrackEventQueue, {
          connection: newRedis,
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: 100,
            attempts: 3,
            backoff: {
              type: "exponential",
              delay: 1000,
            },
          },
        })
      : null;

    return CostTrackEventQueue.instance;
  }
}
