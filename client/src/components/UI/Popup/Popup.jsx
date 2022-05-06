import React from "react"


import "./Popup.scss"


import {CSSTransition} from "react-transition-group"

// interface  PopupPropsType {
//   className?: string, timeout?: number, animationClass?: string, inProp:boolean, style?:any, bg?:any
// }

const Popup  = ({className, timeout=500, animationClass, inProp, style, bg, children, ...otherAttributes})=>{
  // const styles = createStyles(style, {bg})
  
  return (
     <CSSTransition 
      unmountOnExit 
      in={inProp} 
      timeout={timeout} 
      classNames={[animationClass ? animationClass : "my-popup"].join(" ")}>
      <div style={style} className={"popup " + className} {...otherAttributes}>
        {children}
      </div>
    </CSSTransition>
  )
  
}
  
export default Popup