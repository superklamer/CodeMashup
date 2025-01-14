import React from 'react';
import {connect} from 'react-redux';
import ExpenseForm from './ExpenseForm';
import {startEditExpense, startRemoveExpense} from '../actions/expenses';

const EditxpensePage = (props) => {
    return (
        <div>
            <div className="page-header">
                <div className="content-container">
                    <h1 className="page-header__title">Edit Expense</h1>
                </div>
            </div>
            <div className="content-container">
                <ExpenseForm
                        expense={props.expense} 
                        onSubmit={(expense) => {
                            props.dispatch(startEditExpense(props.expense.id, expense));
                            props.history.push('/')
                        }}
                    />

                    <div>
                        <button 
                        className="button button--secondary"
                        onClick={() => {
                            props.dispatch(startRemoveExpense({id: props.expense.id}));
                            props.history.push('/');
                        }}>Remove Expense</button>
                    </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state, props) => {
    return {
        expense: state.expenses.find((expense) => expense.id === props.match.params.id)
    };
};

export default connect(mapStateToProps)(EditxpensePage);