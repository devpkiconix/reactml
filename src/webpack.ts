import { codegenSpec } from "./codegen";

const loader = (compName: string) =>
    (rtml: string): Promise<string> =>
        new Promise((resolve, reject) =>
            codegenSpec(rtml)
                .fork(reject, resolve));

// tslint:disable-next-line:no-default-export
export default loader;