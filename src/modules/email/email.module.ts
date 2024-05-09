import { Module } from '@nestjs/common';
import { EmailRepository } from 'src/modules/email/repositories/email.repository';
import { EmailService } from 'src/modules/email/services/email.service';

@Module({
    providers: [EmailService, EmailRepository],
    exports: [EmailService],
})
export class EmailModule {}
