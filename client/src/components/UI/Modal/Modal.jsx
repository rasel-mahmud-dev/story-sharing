import React from "react"
import { createPortal } from "react-dom" 
import "./Modal.scss"
import {CSSTransition} from "react-transition-group"

// interface ModalProps {
//   inProp: boolean
//   className?: string,
//   onClose?: any,
//   animationClassName?: string,
//   style?: React.CSSProperties,
//   timeout?: object | number
// }

const Modal = (props)=>{
  const { onClose, inProp,
    animationClassName,
    timeout,
    ...attributes 
  } = props
  
  
  return createPortal(
      <CSSTransition
        unmountOnExit in={inProp} timeout={timeout ? timeout : 1000}
        classNames={[animationClassName ? animationClassName : "my-modal"].join(" ")}>
        <div {...attributes} className={"modal " + props.className} >
          {props.children}
          { onClose && <span className="modal-close_icon" onClick={onClose}
            >
            <i className="fa fa-times"/>
            </span> }
        </div>
      </CSSTransition>,
      document.getElementById("modal-root")
    )
}


export default Modal
