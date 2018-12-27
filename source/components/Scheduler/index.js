// Core
import React, { Component } from 'react';

//Components
import Task from 'components/Task';
import  Checkbox  from '../../theme/assets/Checkbox';
import Spinner from 'components/Spinner';
import Catcher from 'components/Catcher';
import { sortTasksByGroup } from 'instruments/helpers';

// Instruments
import Styles from './styles.m.css';
import { api, TOKEN } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    state = {
        tasks:          [],
        isPostFetching: false,
        new_message:    '',
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isPostFetching: state,
        });
    }

    async componentDidMount() {
        this._setTasksFetchingState(true);
        const tasks = await api.fetchTasks();          

        this.setState({
          tasks,
          isPostFetching: false,
        });
    }

    _filterTasks = ( event ) => {       
        console.log('event.target.value', event.target.value);
        const { tasks } = this.state;
        this.setState({
            tasks:          tasks.filter((task) => task.message.match(event.target.value)),
            isPostFetching: false,
        });
    } 

    _createTask = async () => {
        this._setTasksFetchingState(true);
        
        const {new_message} = this.state;        
        if (!new_message) {
            return null;
        }        

        const task = await api.createTask(new_message);        
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
        this._setTasksFetchingState(true);
        const { tasks } = this.state;        

        api.removeTask(id);   

        this.setState({
            tasks:          tasks.filter((task) => task.id !== id),
            isPostFetching: false,
        });
    }

    _updateTask = async (params) => {        
        const tasks_new = await api.updateTask(params);      

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => task.id === tasks_new[0].id ? tasks_new[0] : task),
            isPostFetching: false,
        }));

        //sort
        const {tasks} = this.state;
        this.setState({
            tasks: sortTasksByGroup(tasks),
        });
    }
    
    _completeAllTasks = async () => {
        const { tasks } = this.state;
        this._setTasksFetchingState(true);

        //tasks.map((task) => { task.completed = true });
        
        const new_tasks =  api.completeAllTasks(tasks);    

        /* this.setState({
            tasks: sortTasksByGroup(new_tasks),
            isPostFetching: false,
        }); */
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
                        <input type="text" onChange = { this._filterTasks } />
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
                            onClick = { this._completeAllTasks }
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
