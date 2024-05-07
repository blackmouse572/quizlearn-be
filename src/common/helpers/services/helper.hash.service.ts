import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SHA256, enc, HmacSHA512 } from 'crypto-js';
import CryptoJS from 'crypto-js';
import { IHelperHashService } from 'src/common/helpers/interfaces/helper.hash-service';

@Injectable()
export class HelperHashService implements IHelperHashService {
    randomSalt(length: number): string {
        return genSaltSync(length);
    }

    bcrypt(passwordString: string, salt: string): string {
        return hashSync(passwordString, salt);
    }

    bcryptCompare(passwordString: string, passwordHashed: string): boolean {
        return compareSync(passwordString, passwordHashed);
    }

    sha256(string: string): string {
        return SHA256(string).toString(enc.Hex);
    }

    sha256Compare(hashOne: string, hashTwo: string): boolean {
        return hashOne === hashTwo;
    }

    signHMACSHA512(data: string, secret: string): string {
        const hmac = HmacSHA512(data, secret);

        return hmac.toString(CryptoJS.enc.Hex);
    }
}
