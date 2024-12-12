import React from "react";

const Card = (props) => {
    console.log(props)
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{props.name}</h5>
                <p className="card-text">{props.attributes.department}</p>
            </div>
        </div>
    );
}

export default Card