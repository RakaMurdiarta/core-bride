import { WorkerHost } from '@nestjs/bullmq';

export abstract class IWorkerListener extends WorkerHost {}
