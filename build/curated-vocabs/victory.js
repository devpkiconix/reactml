"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtmlVocab_1 = require("../rtmlVocab");
const render_1 = require("../render");
// tslint:disable-next-line:no-any
let loadPromise; // promise to load victory library
/**
 * It appears that the victory charts library doesn't allow importing
 * of individual components, so we load it once when we need it
 * and then pick components from the loaded library.
 */
const maybeImport = () => loadPromise ?
    loadPromise // load only once
    :
        (loadPromise = Promise.resolve().then(() => require(/* webpackChunkName: 'victory-charts' */ 'victory')));
const maybeLoad = (name) => render_1.asyncComponent(name, () => maybeImport().then(victory => {
    victoryVocab.update(name, victory[name]);
    return victoryVocab;
}));
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
};
const victoryVocab = rtmlVocab_1.newVocab(tags);
// tslint:disable-next-line:no-default-export
exports.default = victoryVocab;
//# sourceMappingURL=victory.js.map