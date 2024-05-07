import { Module } from '@nestjs/common';
import { DatabaseOptionsService } from 'src/common/database/service/database.options.service';

@Module({
    providers: [DatabaseOptionsService],
    exports: [DatabaseOptionsService],
})
export class DatabaseOptionsModule {}
