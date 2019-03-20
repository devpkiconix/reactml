import { codegenSpec } from "./codegen";

// tslint:disable-next-line:no-default-export
export default (str: string) => codegenSpec(str).promise();
