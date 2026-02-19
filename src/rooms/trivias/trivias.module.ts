import { Module } from '@nestjs/common';
import { TriviasController } from './trivias.controller';
import { TriviasService } from './trivias.service';
import { PrismaService } from '../../prisma.service';
import { RoomsModule } from '../rooms.module';

@Module({
  imports: [RoomsModule],
  controllers: [TriviasController],
  providers: [TriviasService, PrismaService],
  exports: [TriviasService],
})
export class TriviasModule {}
