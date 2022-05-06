
import React from "react"

const Badge = (props) => {
  const { count, className, ...attributes } = props
  
  return (
    <div className={"text-center rounded-full text-xs font-400 w-min-10 " + className} {...attributes}>
      {count}
    </div>
  );
};

export default Badge;