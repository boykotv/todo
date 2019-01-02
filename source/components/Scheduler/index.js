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
        this._fetchTasksAsync();
    }

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);
        const tasks = await api.fetchTasks();  
        this.setState({
            tasks: sortTasksByGroup(tasks),
          });
        this._setTasksFetchingState(false);
    }

    _updateTasksFilter = ( event ) => {    
        const filterWord = event.target.value.toLowerCase();
        const { tasks } = this.state;

        const result = tasks.filter(task => task.message.indexOf(filterWord) != -1);
        console.log('result', result);

        this.setState({
            //tasks: tasks.filter(task => task.message.indexOf(filterWord) != -1), //?
            tasksFilter: filterWord,
        });
    } 

    _createTaskAsync = async (event) => {        
        event.preventDefault();  
        const {newTaskMessage} = this.state;        
        if (!newTaskMessage) {
            return null;
        };      
        this._setTasksFetchingState(true);              

        const task = await api.createTask(newTaskMessage);        
        this.setState(({tasks}) => ({
            tasks: [task, ...tasks],
            newTaskMessage: '',
        }));
        this._setTasksFetchingState(false);
    }

    _updateNewTaskMessage = ( event ) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    } 

    _handleFormSubmit = (event) => {
        this._createTaskAsync(event);
    }

    _submitOnEnter = (event) => {        
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            this._createTaskAsync(event);
        }
    }

    _removeTaskAsync = async (id) => {        
        this._setTasksFetchingState(true);
        const { tasks } = this.state;        

        api.removeTask(id);   

        this.setState({
            tasks: tasks.filter((task) => task.id !== id),
        });
        this._setTasksFetchingState(false);
    }

    _updateTaskAsync = async (params) => {       
        this._setTasksFetchingState(true); 
        const tasks_new = await api.updateTask([params]);      

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => task.id === tasks_new[0].id ? tasks_new[0] : task),
        }));

        //sort
        const {tasks} = this.state;
        this.setState({
            tasks: sortTasksByGroup(tasks),
        });
        this._setTasksFetchingState(false);
    }
    
    _completeAllTasksAsync = async () => {        
        const completeAll = this._getAllCompleted();        
        if ( completeAll ) { //all tasks are completed
            return null;
        }
        
        this._setTasksFetchingState(true);
        const { tasks } = this.state;
           
        const tasks_for_complete = tasks.filter((task) => task.completed === false );    
        
        await api.completeAllTasks(tasks_for_complete); //передать только невыполненые

        tasks.map((task) => task.completed = true );        
        this.setState({
            tasks: sortTasksByGroup(tasks),
        });        
        this._setTasksFetchingState(false);
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;
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
        return completeAll;
    }

    render () {
        const { tasks, isTasksFetching, newTaskMessage, tasksFilter } = this.state;

        const completeAll = this._getAllCompleted();
               
        const tasksJSX = tasks.map(( task ) => {
            return <Catcher key = { task.id }>
                        <Task {...task} 
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
                            type = "search" 
                            onChange = { this._updateTasksFilter } 
                            placeholder = "Поиск"          
                            value = { tasksFilter }
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
                                className = { Styles.createTask }
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
                            onClick = { this._completeAllTasksAsync }
                            checked = { completeAll }
                            color1 = '#363636'
                            color2 = '#fff'
                        /> 
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>

                </main>
            </section>         
        );
    }
}
