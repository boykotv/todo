/* // Core
import React, { Component } from 'react';
import {createPortal} from 'react-dom';
import {bool} from 'prop-types';

//Instruments
import Styles from './styles.m.css';

const portal = document.getElementById('spinner');

export default class Spinner extends Component {
    static propTypes = {
        isTasksFetching: bool.isRequired,
    };
    static defaultProps = {
        isTasksFetching: false,
    };

    render () {
        const { isTasksFetching } = this.props;

        return createPortal(
            isTasksFetching ? <div className = { Styles.spinner } /> : null, 
            portal,
        );
    }
}  */


// Core`
import React from 'react';
import PropTypes from 'prop-types';
// Instruments
import Styles from './styles.m.css';

const Spinner = ({ isSpinning }) =>
    isSpinning && <div className = { Styles.spinner } />;

Spinner.propTypes = {
    isSpinning: PropTypes.bool.isRequired,
};

export default Spinner;