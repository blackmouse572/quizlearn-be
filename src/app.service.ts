import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/modules/accounts/services/account.service';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    constructor(private readonly userService: UserService) {}

    getHello(): string {
        return 'Hello World!';
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        this.logger.debug('Start reset user AI count');
        const users = await this.userService.findAll({}, { lean: false });
        let count = 0;
        users.forEach((user) => {
            try {
                count++;
                this.userService.resetUserAICount(user);
                this.logger.log(
                    `Reset user ${user.email} with ${user.useAICount} AI count`
                );
            } catch (error) {
                this.logger.error(error);
            }
        });
        this.logger.debug(`Reset ${count} user AI count`);
    }
}
