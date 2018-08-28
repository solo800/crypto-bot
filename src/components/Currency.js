import React from 'react';

const Currency = props => {
    return (
        <option value={props.asset_id} selected={props.selected}>{props.name}</option>
    );
};

export default Currency;