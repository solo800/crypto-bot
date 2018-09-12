import React from 'react';

const Item = props => {
    return (
        <option {...props}>{props.name}</option>
    );
};

export default Item;