
import React from "react";

import "./styles.scss"



const Spin = (props) => {
  
  const { style, size, border=3, baseBorderColor, loaderBorderColor } = props
  
  const spinnerStyles = {}
  if(size && size !== 0){
    spinnerStyles.width = size + "px"
    spinnerStyles.height = size + "px"
  }
  
  const baseLoader = {}
  const overlayStyles  = {}
  
  
  baseLoader.border = `${border ? border : 3}px solid ${baseBorderColor ? baseBorderColor : '#cbcbcb'}`
  overlayStyles.borderWidth = `${border ? border : 3}px`
  overlayStyles.borderRightColor = `${loaderBorderColor ? loaderBorderColor : "#587fff"}`

  return (
    <div style={{...style, ...spinnerStyles}} className={"spinner"}>
      <span style={baseLoader} className={"base-loader"} />
      <span style={overlayStyles} className={"overlay-loader"} />
    </div>
  );
};

export default Spin;

