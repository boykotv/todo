// Core
import React, { Component } from 'react';

//Components
import Task from 'components/Task';

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
                                { tasksJSX }
                            </ul>
                        </div>
                    </section>


                    <footer>
                        <div>
                            <svg version="1.1" viewBox="0 0 27 27" style = { {
                                                                        width: 25,
                                                                        height: 25,
                                                                        display: 'block',
                                                                    } }>
                                <g>
                                    <rect fill="#fff" height="25" rx="5" ry="5" stroke="#363636" width="25" x="1" y="1" style = { { strokewidth: 2 } } ></rect>
                                    <path d="M22.12 6c-3.12 3.16-6.84 6.36-10.23 9.64l-5.42-4.05L4 14.84l6.78 5.08L12.23 21l1.25-1.25C17 16.2 21.29 12.6 25 8.89z" fill="#fff"></path>
                                </g>
                            </svg>
                        </div>
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>

                </main>
            </section>
        );
    }
}
