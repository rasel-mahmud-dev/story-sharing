
// this function function for lazy route load...........
import {lazy} from "react";

const ReactLazyPreload  = (importStatementFn)=>{
    const Component = lazy(importStatementFn)

    // Component.preload call when preload link clicked
    Component.preload = importStatementFn
    return Component
}


export default  ReactLazyPreload