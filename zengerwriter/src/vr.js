import { useRef } from "react";

function VerticalRule( props ) {

    var xloc = useRef(props.xloc);

    return (
        <div className="vr" style={{
            marginLeft: xloc.current
        }}/>
    )

}

export { VerticalRule }