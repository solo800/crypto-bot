import React from 'react';

const Asset = props => {
    return (
        <option value={props.asset_id} selected={props.selected}>{props.name}</option>
    );
};

export default Asset;