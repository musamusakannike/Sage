import { Module } from '@nestjs/common';
import { SquadService } from './squad.service';

@Module({
  providers: [SquadService],
  exports: [SquadService],
})
export class SquadModule {}
