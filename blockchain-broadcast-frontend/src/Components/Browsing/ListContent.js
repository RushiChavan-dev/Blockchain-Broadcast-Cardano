import React from "react";

const ListContent = ({ items, onClick }) => {
    return (<div className="btn-text-list">

        {Object.entries(items).map(([key, value]) =>
            <button
                className="btn-text"
                key={key}
                value={value}
                onClick={onClick}
            >
                {key}
            </button>)
        }</div>
    );
};

export default ListContent;
