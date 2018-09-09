import React from 'react';

const Exchange = props => {
    return (
        <option value={props.exchange_id} selected={props.selected}>{props.name}</option>
    );
};

export default Exchange;