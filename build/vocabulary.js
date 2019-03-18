"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vocabulary {
    constructor(dict) {
        this.dict = dict;
    }
    getDict() {
        return this.dict;
    }
    update(name, fn) {
        this.dict[name] = fn;
        return this;
    }
    add(name, fn) {
        return new Vocabulary(Object.assign({}, this.dict, { [name]: fn }));
    }
    map(name) {
        return this.dict[name];
    }
    mapMulti(names) {
        return names.map(this.map.bind(this));
    }
    merge(...rest) {
        const merged = rest.reduce((dict, v) => (Object.assign({}, dict, v.getDict())), this.dict);
        return new Vocabulary(merged);
    }
}
// create new vocab
exports.newVocab = (dict) => new Vocabulary(dict || {});
//# sourceMappingURL=vocabulary.js.map