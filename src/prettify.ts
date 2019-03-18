import { format } from 'prettier';
// tslint:disable-next-line:no-default-export
export default (code: string): string => format(code, { parser: "babel" });
