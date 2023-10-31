import React from 'react';

export default function GameLog(props) {
    return (
        <div className="gamelog">
            <div className="gamelog-header">Логи игры</div>
            <ul className="gamelog-list">
                {props.logs.map((item, index) => {
                    return (
                        <li key={index}>{`${(index === 0) ? '' : String(index) + '.'} ${item}`}</li>
                    )
                })}
            </ul>
        </div>
    )
}