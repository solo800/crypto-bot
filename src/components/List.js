import React from 'react';

const List = (props) => {
    return (
        <div>
            <label>{props.label}</label>
            <select value={props.selected} name={props.name} onChange={props.onChange}>
                {props.items.map(item => <option {...item}>{item.name}</option>)}
            </select>
        </div>
    );
};

export default List;
