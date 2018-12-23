// Core
import React, { Component } from 'react';

export default class Composer extends Component {

    render () {
        return (
            <form onSubmit =  { this._createTask }>
                <input mexlength = "50" placeholder="Описание моей новой задачи"  onChange = { this._updateComment } type="text" />
                <button >Добавить задачу</button>
            </form>
        );
    }
}
