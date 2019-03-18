
export interface Vocab {
    getDict(): Dict;

    // lookup by name
    map(name: string): Function;
    mapMulti(names: string[]): Function[];
    // add a new entry
    add(name: string, fn: Function): Vocab;
    update(name: string, fn: Function): Vocab;

    // merge with other vocabs
    merge(...vacab: Vocab[]): Vocab;
}

export interface Dict {
    [name: string]: Function;
}

class Vocabulary implements Vocab {
    constructor(private dict: Dict) { }

    getDict() {
        return this.dict;
    }

    update(name: string, fn: Function): Vocab {
        this.dict[name] = fn;
        return this;
    }

    add(name: string, fn: Function): Vocab {
        return new Vocabulary({ ...this.dict, [name]: fn, });
    }

    map(name: string): Function {
        return this.dict[name];
    }

    mapMulti(names: string[]): Function[] {
        return names.map(this.map.bind(this));
    }

    merge(...rest: Vocab[]): Vocab {
        const merged: Dict = rest.reduce((dict, v) => ({ ...dict, ...v.getDict() }), this.dict);
        return new Vocabulary(merged);
    }
}

// create new vocab
export const newVocab = (dict: Dict | undefined): Vocab => new Vocabulary(dict || {});

