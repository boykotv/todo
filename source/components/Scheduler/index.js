// Core
import React, { Component } from 'react';

//Components
import Task from 'components/Task';
import  Checkbox  from '../../theme/assets/Checkbox';
import Spinner from 'components/Spinner';
import Catcher from 'components/Catcher';

// Instruments
import Styles from './styles.m.css';
import { MAIN_URL as api, TOKEN } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    state = {
        tasks:          [],
        isPostFetching: false,
        new_message:    '',
    }

    componentDidMount() {
        this._fetchTasks();        
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isPostFetching: state,
        });
    }

    _fetchTasks = async () => {
        
        this._setTasksFetchingState(true);
        
        const response = await fetch(api, {
            method: 'GET',
            headers: {
                Authorization: TOKEN,
            },
        });
        
        const { data: tasks } = await response.json();

        this.setState({
            tasks,
            isPostFetching: false,
        });
    };


    _createTask = async () => {
        this._setTasksFetchingState(true);

        const {new_message} = this.state;
        
        if (!new_message) {
            return null;
        }        

        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify({ 'message': new_message }),
        });
        
        const { data: task } = await response.json();

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

    _removeTask = async (id) => {
        const { tasks } = this.state;
        this._setTasksFetchingState(true);

        await fetch(`${api}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        this.setState({
            tasks:          tasks.filter((task) => task.id !== id),
            isPostFetching: false,
        });
    }

    _updateTask = async (params) => {
        const response = await fetch(api, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify(params),
        });

        const { data: tasks_new } = await response.json();

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => task.id === tasks_new[0].id ? tasks_new[0] : task),
            isPostFetching: false,
        }));
    }


    
    _completeAll = async () => {
        const { tasks } = this.state;
        this._setTasksFetchingState(true);

        tasks.map((task) => {
            task.completed = true
        });
        
        const response = await fetch(api, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify(tasks),
        });

        const { data: tasks_new } = await response.json();

        this.setState({
            tasks: tasks_new,
            isPostFetching: false,
        });
    };



    render () {
        const { tasks, isPostFetching, new_message } = this.state;

        let completeAll;
        if (tasks.length > 0) {
            completeAll = true;
            tasks.map((task) => {
                if (!task.completed) return completeAll = false;
            });   
        }
        else {
            completeAll = false;             
        }
       
        const tasksJSX = tasks.map(( task ) => {
            return <Catcher key = { task.id }>
                        <Task  {...task} 
                              _updateTask = { this._updateTask } 
                              _removeTask = { this._removeTask } 
                        />
                    </Catcher>;
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
                                maxLength = "50"
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
                            onClick = { this._completeAll }
                            Block
                            checked = { completeAll }
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
