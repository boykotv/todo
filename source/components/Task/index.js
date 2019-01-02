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
        isTaskEditing: false,
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

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;
        _removeTaskAsync(id);
    }

    _updateTaskMessageOnKeyDown = ( event ) => {  
        const { newMessage } = this.state;  
        if (!newMessage) {
            return null;            
        } 

        if (event.key ==  'Escape') {            
            this._cancelUpdatingTaskMessage();
            this._setTaskEditingState(false);
            return;
        }         

        if (event.key == 'Enter') {            
            this._updateTask();
            this._setTaskEditingState(false);
        } 
    } 

    _setTaskEditingState = (state) => {
        this.setState({
            isTaskEditing: state,
        });        
        //должен переводить фокус в элемент <input />, использовав ref-ссылку taskInput — только в случае перехода в режим редактирования задачи из обычного (32ms)
    }

    _updateTask = () => {
        const { _updateTaskAsync, message } = this.props;    
        const { newMessage } = this.state;
        if (message == newMessage) {
            this._setTaskEditingState(false);
            return null;
        }        
        if (!newMessage) {
            
        }
        _updateTaskAsync(this._getTaskShape({message: newMessage}));
        this._setTaskEditingState(false);
    }

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value,
        }); 
    }

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;  
        if ( isTaskEditing ) {
            this._updateTask();            
            return null;
        }
        this._setTaskEditingState(!isTaskEditing);
    }

    _cancelUpdatingTaskMessage = () => {
        this.setState({
            newMessage: this.props.message,
        });
        this._setTaskEditingState(false);
    }   

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;        
        _updateTaskAsync(this._getTaskShape({completed: !completed}));
    }
    
    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;        
        _updateTaskAsync(this._getTaskShape({favorite: !favorite})); 
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
                            disabled = { !isTaskEditing } 
                            maxLength = { 50 } 
                            type="text" 
                            value = { newMessage }
                            onChange = { this._updateNewTaskMessage }                             
                            onKeyDown = { this._updateTaskMessageOnKeyDown }    
                            ref={this.taskInput}
                        />                   
                    </div>

                    <div className = { Styles.actions }>                     
                        <Star
                            onClick = { this._toggleTaskFavoriteState }
                            inlineBlock =  {true }
                            checked = { favorite }
                            className = { Styles.toggleTaskFavoriteState }
                            color1 = '#3B8EF3'
                            color2 = '#000'                            
                        />
                        <Edit   
                            onClick = { this._updateTaskMessageOnClick }
                            className = { Styles.updateTaskMessageOnClick }
                            inlineBlock                         
                            checked = { isTaskEditing }                        
                            className = { Styles.updateTaskMessageOnClick }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                        />
                        <Remove        
                            onClick = { this._removeTask }
                            className = { Styles.removeTask }
                            inlineBlock = { true }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            inlineBlock = { true }                        
                        /> 
                    </div>
                </li> 
            );
    }
}
