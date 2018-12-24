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
    state = {
        tasks: [
            {id: '1', message: 'first task', completed: false, favorite: false},
            {id: '2', message: 'second task', completed: false, favorite: false},
        ],
        isPostFetching: false,
        new_message: '',
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isPostFetching: state,
        });
    }

    _createTask = async () => {
        this._setTasksFetchingState(true);

        const {new_message} = this.state;
        if (!new_message) {
            return null;
        }
        const task = {
            id: getUniqueID(),
            message: new_message,
            completed: false, 
            favorite: false,
        };

        await delay(1200);

        this.setState(({tasks}) => ({
            tasks: [task, ...tasks],
            new_message: '',
            isPostFetching: false,
        }));
    }

    _updateMessage = ( event ) => {
        this.setState({
            new_message: event.target.value,
        });
    } 

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._createTask();
    }

    _submitOnEnter = (event) => {        
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
            this._createTask();
        }
    }

    _favoriteTask = async (id) => {
        this._setTasksFetchingState(true);
        
        await delay(1200);

        const newTasks = this.state.tasks.map((task) => {
            if ( task.id === id ) {
                return {
                    ...task,
                    favorite: true,
                };
            }

            return task;
        });

        this.setState({
            tasks: newTasks,
            isPostFetching: false,
        });
    }

    _removeTask = async (id) => {
        this._setTasksFetchingState(true);

        await delay(1200);

        const newTasks = this.state.tasks.filter(task => task.id != id);
        
        this.setState({
            tasks: newTasks,
            isPostFetching: false,
        })
    }

    _completeTask = async (id) => {
        this._setTasksFetchingState(true);
        
        await delay(1200);

        const newTasks = this.state.tasks.map((task) => {
            if ( task.id === id ) {
                return {
                    ...task,
                    completed: true,
                };
            }

            return task;
        });

        this.setState({
            tasks: newTasks,
            isPostFetching: false,
        });
    }

    render () {
        const { tasks, isPostFetching, new_message } = this.state;
       
        const tasksJSX = tasks.map(( task ) => {
            return <Task key = { task.id } {...task} 
                         _favoriteTask = { this._favoriteTask } 
                         _removeTask = { this._removeTask } 
                         _completeTask = { this._completeTask } 
                    />;
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
