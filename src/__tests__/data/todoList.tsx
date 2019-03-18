// tslint:disable:no-any
// tslint:disable:interface-name

import * as React from 'react';
import { TodoItem } from './todoItem';

interface ITodo {
    description: string;
    key: number;
}

export interface IMainState {
    newItem?: {
        description: string;
    };
    todoList?: ITodo[];
}

export interface IMainProps { }

export class Main extends React.Component<IMainProps, IMainState> {

    state: IMainState = { newItem: { description: '' }, todoList: [] }

    constructor(props) {
        super(props);
        this.changeName = this.changeName.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    changeName(e: any) {
        this.setState({
            newItem: {
                description: e.target.value
            }
        });
    }

    addItem() {
        const list = this.state.todoList;
        list.push({
            description: this.state.newItem.description,
            key: new Date().getTime()
        });
        this.setState({
            todoList: list,
            newItem: { description: '' }
        });
    }

    removeItem(item: ITodo) {
        const list = this.state.todoList.filter(i => i.key !== item.key);
        this.setState({ todoList: list });
    }

    render() {
        const todoItems = this.state.todoList.map(item => {
            return <TodoItem key={item.key} item={item} onRemove={this.removeItem} ></TodoItem>;
        });
        return (
            <div>
                <div>
                    <input type="text" placeholder="input new item" value={this.state.newItem.description} onChange={this.changeName} />
                    <button onClick={this.addItem} >add</button>
                </div>
                <ul>{todoItems}</ul>
            </div>
        );
    }
}