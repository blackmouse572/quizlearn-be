import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { IHelperStringRandomOptions } from 'src/common/helpers/interfaces/helper.interface';
import { IHelperStringService } from 'src/common/helpers/interfaces/helper.string-service.interface';

const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const onlyNumber = '0123456789';

@Injectable()
export class HelperStringService implements IHelperStringService {
    checkEmail(email: string): boolean {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    }

    randomReference(length: number, prefix?: string): string {
        const timestamp = `${new Date().getTime()}`;
        const randomString: string = this.random(length, {
            safe: true,
            upperCase: true,
        });

        return prefix
            ? `${prefix}-${timestamp}${randomString}`
            : `${timestamp}${randomString}`;
    }

    random(length: number, options?: IHelperStringRandomOptions): string {
        let rString = '';
        if (options?.onlyNumber) {
            rString = customAlphabet(onlyNumber, length)();
        } else {
            rString = customAlphabet(alphabet, length)();
        }

        if (options?.upperCase) {
            rString = rString.toUpperCase();
        }

        if (options?.safe) {
            return rString;
        }

        return rString;
    }

    censor(value: string): string {
        value = value.replaceAll(' ', '');
        const length = value.length;
        if (length <= 3) {
            return value;
        }

        const end = Math.ceil(length * 0.7);
        const censorString = '*'.repeat(end > 10 ? 10 : end);
        const visibleString = value.substring(end, length);
        return `${censorString}${visibleString}`;
    }

    checkPasswordWeak(password: string, length?: number): boolean {
        const regex = new RegExp(
            `^(?=.*?[A-Z])(?=.*?[a-z]).{${length ?? 8},}$`
        );

        return regex.test(password);
    }

    checkPasswordMedium(password: string, length?: number): boolean {
        const regex = new RegExp(
            `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{${length ?? 8},}$`
        );

        return regex.test(password);
    }

    checkPasswordStrong(password: string, length?: number): boolean {
        const regex = new RegExp(
            `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${
                length ?? 8
            },}$`
        );

        return regex.test(password);
    }

    checkSafeString(text: string): boolean {
        const regex = new RegExp('^[A-Za-z0-9_-]+$');
        return regex.test(text);
    }
}
