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
        this.taskInput = React.createRef();
      }

    state = {
        isTaskEditing: true,
        newMessage: this.props.message,
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
        const { isTaskEditing } = this.state;
        if (!isTaskEditing) {           
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

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;
        _removeTaskAsync(id);
    }

    _editTask = () => {
        const { isTaskEditing } = this.state;
        if (isTaskEditing) {
            this.setState({
                isTaskEditing: false,
            });
        }
        else {
            this.setState({
                newMessage: this.props.message,
                isTaskEditing: true,
            });
        }
    }

    _updateTaskMessageOnKeyDown = ( event ) => {
        // this.setState({
        //     newMessage: event.target.value,
        // });       
    } 
/* 
    _updateTaskMessageOnKeyDown = (event) => {  
        if (event.keyCode == '13') {
            const { newMessage } = this.state;  
            if (!newMessage) {
                return null;
            } 
            this.setState({
                isTaskEditing: true,
            });
            const { _updateTaskAsync, id, completed, favorite } = this.props;

            _updateTaskAsync([{ 
                'id':        id,
                'message':   newMessage,
                'completed': completed,
                'favorite':  favorite,
            }]);
        }
        else if (event.keyCode == '27') {            
            this.setState({
                newMessage: this.props.message,
                isTaskEditing: true,
            });
        }
    } */

    _setTaskEditingState = (state) => {
        this.setState({
            isTaskEditing: state,
        });
    }

    _updateTask = () => {
        const { _updateTaskAsync, message } = this.props;    
        const { newMessage } = this.state;
        if (message == newMessage) {
            this._setTaskEditingState(false);
            return null;
        }        
        _updateTaskAsync([this._getTaskShape({})]);
        this._setTaskEditingState(false);
    }

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value,
        }); 
    }

    _updateTaskMessageOnClick = (event) => {
        const { isTaskEditing } = this.state; 
        if ( !isTaskEditing ) {
            //✕ компонент должен вызвать метод this._updateTask и вернуть null, если при нажатии на «карандашик» находился в режиме редактирования (7ms)
            //закончили редактировать - отмена
            return null;
        }

        this._setTaskEditingState(!isTaskEditing);
        // ✕ компонент должен вызвать метод this._updateTaskMessageOnKeyDown при нажатии на клавиши Enter или Escape в режиме редактирования (3ms)



    }

    _cancelUpdatingTaskMessage = () => {
    }

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;        
        _updateTaskAsync([this._getTaskShape({completed: !completed})]);
    }
    
    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;        
        _updateTaskAsync([this._getTaskShape({favorite: !favorite})]); 
    }

    render () {
        
        const { favorite, completed } = this.props;
        const { isTaskEditing, newMessage } = this.state;

        return (      
                <li className = { Styles.task }>
                    <div className = { Styles.content }>
                        <Checkbox
                            inlineBlock
                            checked = { completed }
                            className = { Styles.toggleTaskCompletedState }
                            color1 = '#3B8EF3'
                            color2 = '#FFF'
                            onClick = { this._toggleTaskCompletedState }
                        /> 
                        <input 
                            disabled = { isTaskEditing } 
                            maxLength = "50" 
                            type="text" 
                            value = { newMessage }
                            onChange = { this._updateNewTaskMessage }                             
                            onKeyDown = { this._submitOnEnter }                             
                            ref={this.taskInput}
                        />                   
                    </div>

                    <div className = { Styles.actions }>                     
                        <Star
                            onClick = { this._toggleTaskFavoriteState }
                            inlineBlock
                            checked = { favorite }
                            className = { Styles.toggleTaskFavoriteState }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            color3 = '#3B8EF3'                        
                        />
                        <Edit   
                            onClick = { this._updateTaskMessageOnClick }
                            className = { Styles.updateTaskMessageOnClick }
                            inlineBlock                         
                            checked = { !isTaskEditing }                        
                            className = { Styles.updateTaskMessageOnClick }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                        />
                        <Remove        
                            onClick = { this._removeTask }
                            className = { Styles.removeTask }
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
