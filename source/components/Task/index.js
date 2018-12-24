// Core
import React, { PureComponent } from 'react';
import { string, func } from 'prop-types';

//Components
import  Checkbox  from '../../theme/assets/Checkbox';
import  Star  from '../../theme/assets/Star';
import  Edit  from '../../theme/assets/Edit';
import  Remove  from '../../theme/assets/Remove';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    constructor() {
        super();

        this._favoriteTask = this._favoriteTask.bind(this); 
        this._removeTask = this._removeTask.bind(this);            
        this._completeTask = this._completeTask.bind(this); 
    }

    static propTypes = {
        message:       string.isRequired,
        _favoriteTask: func.isRequired,
        _removeTask:   func.isRequired,
        _completeTask: func.isRequired,
    };
    
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

    _favoriteTask () {
        const {_favoriteTask, id } = this.props;
        _favoriteTask(id);
    }

    _removeTask () {
        const { _removeTask, id } = this.props;
        _removeTask(id);
    }

    _completeTask () {
        const { _completeTask, id } = this.props;
        _completeTask(id);
    }
    
    render () {
        const { message, favorite, completed } = this.props;

        return (           
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        onClick = { this._completeTask }
                    /> 
                    <input disabled maxLength = "50" type="text" value = { message }/>                   
                </div>
                
                <div className = { Styles.actions }>                     
                    <Star
                        inlineBlock
                        disabled = {false}                                
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        color3 = '#3B8EF3'
                        onClick = { this._favoriteTask }
                    />
                    <Edit   
                        inlineBlock                         
                        checked = { false }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                    />
                    <Remove                           
                        inlineBlock
                        disabled = { false }   
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        color3 = '#3B8EF3'
                        onClick = { this._removeTask }
                    />                           
                </div>
            </li>
        );
    }
}
