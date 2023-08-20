
import React from "react";
import { CircularProgress } from '@material-ui/core';

const Loading = () => {

    return (
        <div className="loading">
            <CircularProgress
                style={{
                    zIndex: "4",
                    color: "#7a9ea7",
                    width: "2.4rem",
                    height: "2.4rem",
                    position: "fixed", top: "47%", left: "47%",
                }}
                status="loading"
            />
        </div>
    );
};
export default Loading;
