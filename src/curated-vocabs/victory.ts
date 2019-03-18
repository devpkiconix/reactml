import { newVocab } from '../rtmlVocab';
import { asyncComponent } from "../render";

// tslint:disable-next-line:no-any
let loadPromise: Promise<any>; // promise to load victory library

/**
 * It appears that the victory charts library doesn't allow importing
 * of individual components, so we load it once when we need it
 * and then pick components from the loaded library.
 */
const maybeImport = () =>
    loadPromise ?
        loadPromise // load only once
        :
        (loadPromise =
            import( /* webpackChunkName: 'victory-charts' */ 'victory'));


const maybeLoad = (name: string) => asyncComponent(name, () =>
    maybeImport().then(victory => {
        victoryVocab.update(name, victory[name]);
        return victoryVocab;
    })
);

const tags = {
    VictoryChart: maybeLoad('VictoryChart'),
    VictoryPie: maybeLoad('VictoryPie'),
    VictoryGroup: maybeLoad('VictoryGroup'),
    VictoryPortal: maybeLoad('VictoryPortal'),
    VictoryLabel: maybeLoad('VictoryLabel'),
    VictoryTheme: maybeLoad('VictoryTheme'),
    VictoryTooltip: maybeLoad('VictoryTooltip'),
    VictoryBar: maybeLoad('VictoryBar'),
    VictoryLine: maybeLoad('VictoryLine'),
    VictoryVoronoi: maybeLoad('VictoryVoronoi'),
    VictoryAxis: maybeLoad('VictoryAxis'),
    VictoryCandlestick: maybeLoad('VictoryCandlestick'),
    /* etc */
};

const victoryVocab = newVocab(tags);
// tslint:disable-next-line:no-default-export
export default victoryVocab;
