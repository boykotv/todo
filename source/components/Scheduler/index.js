// Core
import React, { Component } from 'react';

//Components
import Task from 'components/Task';
import  Checkbox  from '../../theme/assets/Checkbox';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    state = {
        tasks: [
            {id: '1', comment: 'first task'},
            {id: '2', comment: 'second task'},
        ],
    }
    render () {
        const { tasks } = this.state;
        const tasksJSX = tasks.map(( task ) => {
            return <Task key = { task.id } {...task} />;
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    
                    <header>
                        <h1>Планировщик задач</h1>
                        <input type="text"/>
                    </header>

                    <section>
                        <form>
                            <input mexlength = "50" placeholder="Описание моей новой задачи" type="text" />
                            <button>Добавить задачу</button>
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
