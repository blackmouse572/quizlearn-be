import ms from 'ms';
export function seconds(duration: string) {
    return ms(duration) / 1000;
}
