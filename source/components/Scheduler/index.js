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
        isTasksFetching: false,
        newTaskMessage: '',
        tasksFilter:    '',
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    }

    async componentDidMount() {
        this._setTasksFetchingState(true);
        const tasks = await api.fetchTasks();          

        this.setState({
          tasks: sortTasksByGroup(tasks),
          isTasksFetching: false,
        });
    }

    _filterTasks = ( event ) => {       
        console.log('event.target.value', event.target.value);
        const { tasks } = this.state;
        this.setState({
            tasks:          tasks.filter((task) => task.message.match(event.target.value)),
            isTasksFetching: false,
        });
    } 

    _createTaskAsync = async () => {
        this._setTasksFetchingState(true);
        
        const {newTaskMessage} = this.state;        
        if (!newTaskMessage) {
            return null;
        }        

        const task = await api.createTask(newTaskMessage);        
        this.setState(({tasks}) => ({
            tasks: [task, ...tasks],
            newTaskMessage: '',
            isTasksFetching: false,
        }));
    }

    _updateNewTaskMessage = ( event ) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    } 

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._createTaskAsync();
    }

    _submitOnEnter = (event) => {        
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
            this._createTaskAsync();
        }
    }

    _removeTaskAsync = async (id) => {        
        this._setTasksFetchingState(true);
        const { tasks } = this.state;        

        api.removeTask(id);   

        this.setState({
            tasks:          tasks.filter((task) => task.id !== id),
            isTasksFetching: false,
        });
    }

    _updateTaskAsync = async (params) => {        
        const tasks_new = await api.updateTask(params);      

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => task.id === tasks_new[0].id ? tasks_new[0] : task),
            isTasksFetching: false,
        }));

        //sort
        const {tasks} = this.state;
        this.setState({
            tasks: sortTasksByGroup(tasks),
        });
    }
    
    _getAllCompleted =  () => {
        const { tasks } = this.state;
        this._setTasksFetchingState(true);

        api.completeAllTasks(tasks);

        tasks.map((task) => { task.completed = true });
        
        this.setState({
            tasks: sortTasksByGroup(tasks),
            isTasksFetching: false,
        });
    };

    render () {
        const { tasks, isTasksFetching, newTaskMessage } = this.state;

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
                              _updateTaskAsync = { this._updateTaskAsync } 
                              _removeTaskAsync = { this._removeTaskAsync } 
                        />
                    </Catcher>;
        });

        return (            

            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    
                    <header>
                        <h1>Планировщик задач</h1>
                        <input 
                            type="search" 
                            onChange = { this._filterTasks } 
                            placeholder="Поиск"          
                            value=""
                        />
                    </header>

                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input 
                                maxLength = {50}
                                placeholder="Описание моей новой задачи" 
                                type="text" 
                                onChange = { this._updateNewTaskMessage } 
                                onKeyPress = { this._submitOnEnter } 
                                value = { newTaskMessage } 
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
                            onClick = { this._getAllCompleted }
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
