// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    render () {
        const { comment } = this.props;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <div className = { Styles.toggleTaskCompletedState }> </div>
                    <input disabled type="text" value = { comment }/>                   
                </div>
                
                <div className = { Styles.actions }> 
                    <div className = { Styles.toggleTaskFavoriteState } >
                    </div>
                    <div className = { Styles.updateTaskMessageOnClick } >
                    </div>            
                </div>
            </li>
        );
    }
}
