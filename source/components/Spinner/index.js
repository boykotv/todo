// Core
import React, { Component } from 'react';
import {createPortal} from 'react-dom';
import {bool} from 'prop-types';

//Instruments
import Styles from './styles.m.css';

export default class Spinner extends Component {
    static propTypes = {
        isSpinning: bool.isRequired,
    };
    static defaultProps = {
        isSpinning: false,
    };

    render () {
        const { isSpinning } = this.props;

        return (
            isSpinning ? <div className = { Styles.spinner } /> : null            
        );
    }
} 
