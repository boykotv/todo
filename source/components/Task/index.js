// Core
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

//Components
import  Checkbox  from '../../theme/assets/Checkbox';
import  Star  from '../../theme/assets/Star';
import  Edit  from '../../theme/assets/Edit';
import  Remove  from '../../theme/assets/Remove';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    static propTypes = {
        message: PropTypes.string.isRequired,
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

    render () {
        const { message } = this.props;

        return (           
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { false }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                    /> 
                    <input disabled maxLength = "50" type="text" value = { message }/>                   
                </div>
                
                <div className = { Styles.actions }>                     
                    <Star
                        inlineBlock
                        hover = { false }
                        disabled = {false}                                
                        checked = { false }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        color3 = '#3B8EF3'
                    />
                    <Edit   
                        inlineBlock                         
                        hover = { false }
                        checked = { false }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                    />
                    <Remove                           
                        inlineBlock
                        hover = { false }
                        disabled = { false }   
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        color3 = '#3B8EF3'
                    />                           
                </div>
            </li>
        );
    }
}
