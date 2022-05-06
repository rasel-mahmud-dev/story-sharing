import React from 'react';
import "./styles.scss"
const Circle = (props) => {
    const { style={}, className, radius, width, height, bg } = props

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
            // <div className="circle_wrapper">
        <div style={styles} className={["circle", className].join(" ")}>

            {/*</div>*/}
        </div>
    );
};

export default Circle;