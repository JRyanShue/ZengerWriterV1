import { useRef, useState, forwardRef, useImperativeHandle } from "react"

function NavElement(props, ref) {

    var [myClass, setClass] = useState(props.className);

    // for ref forwarding
    // const inputRef = useRef();
    // useImperativeHandle(ref, () => ({
    //     focus: () => {
    //         inputRef.current.focus();
    //     }
    // }));


    var name = useRef(props.name);
    function handleClick() {
        props.handleClick();
        // setClass("selected-nav-element");
    }

    return (

        <div onClick={handleClick} ref={ref} className={myClass}>
            <div className="noselect">
                <p className="child-text">
                    {name.current}
                </p>
            </div>
        </div>
        
    )
}
NavElement = forwardRef(NavElement);

export { NavElement }