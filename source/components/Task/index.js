// Core
import React, { PureComponent } from 'react';
import { string, func, bool } from 'prop-types';

//Components
import  Checkbox  from '../../theme/assets/Checkbox';
import  Star  from '../../theme/assets/Star';
import  Edit  from '../../theme/assets/Edit';
import  Remove  from '../../theme/assets/Remove';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    state = {
        disabled: true,
    }

    static propTypes = {
        id:            string.isRequired,          
        completed:     bool.isRequired,
        favorite:      bool.isRequired,
        message:       string.isRequired,
        _updateTask:   func.isRequired,
        _removeTask:   func.isRequired,
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

    _favoriteTask = () => {
        const { _updateTask, id, message, completed, favorite } = this.props;

        _updateTask([{ 
            'id':        id,
            'message':   message,
            'completed': completed,
            'favorite':  !favorite,
        }]);
    }

    _completeTask = () => {
        const { _updateTask, id, message, completed, favorite } = this.props;

        _updateTask([{ 
            'id':        id,
            'message':   message,
            'completed': !completed,
            'favorite':  favorite,
        }]);
    }

    _removeTask = () => {
        const { _removeTask, id } = this.props;
        _removeTask(id);
    }

    _editTask = () => {
        this.setState({
            disabled: false,
        });
    }

    render () {
        
        const { message, favorite, completed } = this.props;
        const { disabled } = this.state;
        //const { id, completed, favorite, message } = this._getTaskShape(this.props);

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
                    <input 
                        disabled = { disabled } 
                        maxLength = "50" 
                        type="text" 
                        value = { message }
                    />                   
                </div>
                
                <div className = { Styles.actions }>                     
                    <Star
                        onClick = { this._favoriteTask }
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        color3 = '#3B8EF3'                        
                    />
                    <Edit   
                        onClick = { this._editTask }
                        inlineBlock                         
                        checked = { false }                        
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                    />
                    <Remove        
                        onClick = { this._removeTask }                   
                        inlineBlock
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        color3 = '#3B8EF3'                        
                    />                           
                </div>
            </li>
        );
    }
}
