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
    constructor(props) {
        super(props);
        // create a ref to store the taskInput DOM element
        this.taskInput = React.createRef();
      }

    state = {
        disabled: true,
        message: this.props.message,
    }

    static propTypes = {
        id:            string.isRequired,          
        completed:     bool.isRequired,
        favorite:      bool.isRequired,
        message:       string.isRequired,
        created:       string.isRequired,
        modified:      string.isRequired,
        _updateTaskAsync:   func.isRequired,
        _removeTaskAsync:   func.isRequired,
    };   
    static defaultProps = {
        modified: '',
        created: '',
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


    componentDidUpdate(nextProps, nextState) {
        const { disabled } = this.state;
        if (!disabled) {           
            this.taskInput.current.focus();
        }
    }

    _favoriteTask = () => {
        const { _updateTaskAsync, id, message, completed, favorite } = this.props;

        _updateTaskAsync([{ 
            'id':        id,
            'message':   message,
            'completed': completed,
            'favorite':  !favorite,
        }]);
    }

    _completeTask = () => {
        const { _updateTaskAsync, id, message, completed, favorite } = this.props;

        _updateTaskAsync([{ 
            'id':        id,
            'message':   message,
            'completed': !completed,
            'favorite':  favorite,
        }]);
    }

    _removeTaskAsync = () => {
        const { _removeTaskAsync, id } = this.props;
        _removeTaskAsync(id);
    }

    _editTask = () => {
        const { disabled } = this.state;
        if (disabled) {
            this.setState({
                disabled: false,
            });
        }
        else {
            this.setState({
                message: this.props.message,
                disabled: true,
            });
        }
    }

    _updateMessage = ( event ) => {
        this.setState({
            message: event.target.value,
        });       
    } 

    _submitOnEnter = (event) => {  
        if (event.keyCode == '13') {
            const { message } = this.state;  
            if (!message) {
                return null;
            } 
            this.setState({
                disabled: true,
            });
            const { _updateTaskAsync, id, completed, favorite } = this.props;

            _updateTaskAsync([{ 
                'id':        id,
                'message':   message,
                'completed': completed,
                'favorite':  favorite,
            }]);
        }
        else if (event.keyCode == '27') {            
            this.setState({
                message: this.props.message,
                disabled: true,
            });
        }
    }

    render () {
        
        const { favorite, completed } = this.props;
        const { disabled, message } = this.state;
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
                            onChange = { this._updateMessage } 
                            onKeyDown = { this._submitOnEnter } 
                            
                            ref={this.taskInput}
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
                            checked = { !disabled }                        
                            className = { Styles.updateTaskMessageOnClick }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                        />
                        <Remove        
                            onClick = { this._removeTaskAsync }                   
                            inlineBlock
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            color3 = '#3B8EF3'   
                            over={false}
                            inlineBlock={true}     
                            checked={false}
                        />
                    </div>
                </li>
           
        );
    }
}
