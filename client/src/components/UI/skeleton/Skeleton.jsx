import React from 'react';
import Line from "./Line";

import "./styles.scss"
import Circle from "./Circle";

const Skeleton = (props) => {
    const {style={}, className, delay, ...other} = props

    const styles = {...style}
    if (delay){
        styles.animationDelay = delay
    }

    return (
        <div style={styles} className={["skeleton_group", className].join(" ")} {...other}>
            {props.children}
        </div>
    );
};


Skeleton.Line = Line
Skeleton.Circle = Circle

export default Skeleton;