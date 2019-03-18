// tslint:disable:no-any
// tslint:disable:interface-name

import * as React from 'react';

interface ITodo {
    description: string;
}

export interface ITodoItemState { }

export interface ITodoItemProps {
    item: ITodo;
    onRemove?: (todo: ITodo) => any;
    key?: number; // I think this prop is unnecessary, but unless it an error occurs in tsc.
}

export class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {
    constructor(props) {
        super(props);
        this.removeItem = this.removeItem.bind(this);
    }

    removeItem() {
        this.props.onRemove(this.props.item);
    }

    render() {
        return (
            <li>
                <span> {this.props.item.description} </span>
                <button onClick={this.removeItem} >delete</button>
            </li>
        );
    }
}