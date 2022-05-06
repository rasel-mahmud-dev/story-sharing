import React from 'react';

import "./styles.scss"

const Line = (props) => {
    const { style={}, className,  radius, width, height, bg } = props

    const styles = {...style}
    if(height){
        styles.height = height
    }
    if(width){
        styles.width = width
    }
    if (radius){
        styles.borderRadius = radius
    }
    if(bg){
        styles.background = bg
    }


    return (
        // <div className="line_wrapper">
            <div className={["line", className].join(" ")} style={styles}/>
        // </div>
    );
};

export default Line;