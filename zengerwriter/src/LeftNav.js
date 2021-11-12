
import { NavElement } from './NavElement'

import { useRef, createRef, forwardRef, useEffect } from 'react'

function LeftNav(props) {

    // Callback
    var setApp = props.setApp;

    var currentSelection = useRef('queue');

    function updateNav() {

        console.log(currentSelection.current)
        for (var ref in refs){

            console.log(ref)
            // For selected button: turn blue
            if (ref == currentSelection.current){
                refs[ref].current.className = 'selected-nav-element';
            } 
            // For non-selected buttons: normal class
            else {
                refs[ref].current.className = 'nav-element';
            }
            
        }

    }

    // Go to page and highlight selected nav element
    function select(selection) {

        setApp(selection);
        currentSelection.current = selection;

        updateNav(); 

    }

    // refs for accessing children nav elements
    var refs = {
        'queue': createRef(),
        'manage': createRef()
    }

    // The JSX elements of the child navs, stored in variables
    var queueNav = <NavElement name="Queue/Prepare" ref={refs['queue']} className="nav-element" handleClick={() => {
        select('queue');
    }}/>;
    var manageNav = <NavElement name="Manage" ref={refs['manage']} className="nav-element" handleClick={() => {
        select('manage');
    }}/>;

    useEffect(
        () => {
            updateNav();
        }
    )


    return (

        <div className="leftNav">
            {queueNav}
            {manageNav}
        </div>

    )
}

export { LeftNav }