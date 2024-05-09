import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid, {
    ClientResponse,
    MailDataRequired,
    ResponseError,
} from '@sendgrid/mail';

@Injectable()
export class EmailRepository {
    constructor(private readonly configService: ConfigService) {
        SendGrid.setApiKey(this.configService.get('sendgrid.key'));
    }

    send(
        data: MailDataRequired | MailDataRequired[],
        isMultiple?: boolean,
        cb?: (
            err: Error | ResponseError,
            result: [ClientResponse, unknown]
        ) => void
    ) {
        return SendGrid.send(data, isMultiple, cb);
    }

    sendMultiple(
        data: MailDataRequired,
        cb?: (
            error: Error | ResponseError,
            result: [ClientResponse, unknown]
        ) => void
    ): Promise<[ClientResponse, unknown]> {
        return SendGrid.sendMultiple(data, cb);
    }
}
