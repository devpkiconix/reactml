import { FutureInstance } from "fluture";
import { Vocab } from './vocabulary';

export type FutVal<T> = FutureInstance<Error, T>;
// tslint:disable-next-line:no-any
export type PropMapper = (ctx: SpecRenderCtx, appState: any) => (state: any) => (propVal: any, ) => any;
// tslint:disable-next-line:no-any
export type ReactProps = { [index: string]: any; };

export interface SpecRenderCtx {
    vocab: Vocab;
    propMapper?: PropMapper;
    state?: {};
}
