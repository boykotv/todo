// Core
import React, { Component } from 'react';

//Components
import Task from 'components/Task';
import  Checkbox  from '../../theme/assets/Checkbox';
import Spinner from 'components/Spinner';
import Composer from 'components/Composer';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    

    state = {
        tasks: [
            {id: '1', comment: 'first task'},
            {id: '2', comment: 'second task'},
        ],
        isPostFetching: true,
    }

    _updateComment ( event ) {
        console.log('_updateComment');
        this.setState({
            comment: event.target.value,
        });
    }

    render () {
        const { tasks, isPostFetching } = this.state;
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
                        <Composer/>
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
