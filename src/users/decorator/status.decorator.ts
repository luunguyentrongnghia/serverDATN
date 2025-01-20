import { SetMetadata } from '@nestjs/common';
export const Status = (...status: string[]) => SetMetadata('status', status);
