// Core
import React, { Component } from 'react';

//Components
import Task from 'components/Task';
import  Checkbox  from '../../theme/assets/Checkbox';
import Spinner from 'components/Spinner';
//import Composer from 'components/Composer';

// Instruments
import Styles from './styles.m.css';
import { getUniqueID, delay } from 'instruments/helpers';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    constructor() {
        super();
        this._createTask = this._createTask.bind(this);
        this._updateMessage = this._updateMessage.bind(this);
        this._handleFormSubmit = this._handleFormSubmit.bind(this);
        this._submitOnEnter = this._submitOnEnter.bind(this);
        
    }

    state = {
        tasks: [
            {id: '1', message: 'first task'},
            {id: '2', message: 'second task'},
        ],
        isPostFetching: false,
        new_message: '',
    }

    async _createTask () {
        this.setState({
            isPostFetching: true,
        });

        const {new_message} = this.state;
        if (!new_message) {
            return null;
        }
        const task = {
            id: getUniqueID(),
            message: new_message,
        };

        await delay(1200);

        this.setState(({tasks}) => ({
            tasks: [task, ...tasks],
            new_message: '',
            isPostFetching: false,
        }));
    }

    _updateMessage ( event ) {
        this.setState({
            new_message: event.target.value,
        });
    } 

    _handleFormSubmit (event) {
        event.preventDefault();
        this._createTask();
    }

    _submitOnEnter (event) {        
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
            this._createTask();
        }
    }

    render () {
        const { tasks, isPostFetching, new_message } = this.state;
       
        const tasksJSX = tasks.map(( task ) => {
            return <Task key = { task.id } {...task} />;
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isPostFetching } />
                <main>
                    
                    <header>
                        <h1>Планировщик задач</h1>
                        <input type="text"/>
                    </header>

                    <section>
                        <form onSubmit =  { this._handleFormSubmit }>
                            <input 
                                mexlength = "50" 
                                placeholder="Описание моей новой задачи" 
                                type="text" 
                                onChange = { this._updateMessage } 
                                onKeyPress = { this._submitOnEnter } 
                                value = { new_message } 
                            />
                            <button >Добавить задачу</button>
                        </form>
                        <div>
                            <ul>
                                <div style = { { position: 'relative' } }>
                                    { tasksJSX }
                                </div>
                            </ul>
                        </div>
                    </section>

                    <footer>
                        <Checkbox
                            Block
                            checked = { false }
                            className = { Styles.toggleTaskCompletedState }
                            color1 = '#363636'
                            color2 = '#FFF'
                        /> 
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>

                </main>
            </section>
        );
    }
}
