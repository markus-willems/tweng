import React from 'react';

const Error = ({ message }) => <div className="error">{message}</div>;

export default ({ errors }) => {
    return (
        <React.Fragment>
            {errors.length > 0 ? (
                <div className="errors">
                    {errors.map((message, i) => (
                        <Error key={i} message={message} />
                    ))}
                </div>
            ) : null}
        </React.Fragment>
    );
};
