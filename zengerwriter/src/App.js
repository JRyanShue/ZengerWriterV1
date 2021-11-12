
import Queue from './Queue';
import Prepare from './Prepare';
import Slice from './Slice';
import { LeftNav } from './LeftNav';
import { Banner } from './Banner'
import { Dividers } from './Dividers';
import { useEffect, useRef, useState } from 'react';

function App(props) {

    /*
        Simulate a multi-page app 
    */

    var username = useRef(props.username);
    var QueueApp = useRef(
        <div>
            <Banner />
            {/* <Slice username={username} serverIP="54.159.145.255"/> */}
            <Queue username={username.current} serverIP="54.159.145.255"/>
            <Prepare username={username.current} serverIP="54.159.145.255"/>
            <Dividers />
        </div>
    )
    var ManageApp = useRef(
        <div>
            <Banner />
            <Dividers />
        </div>
    )
    // Holds the entire page
    const [currentApp, setApp] = useState(QueueApp.current);
    const [current, set] = useState("queue");

    // Passed into components as callback
    function goToPage(page) {
        console.log("1")
        console.log("PAGE:", page)
        switch(page) {
            case 'queue':
                setApp(QueueApp.current);
                break;
            case 'manage':
                setApp(ManageApp.current);
                break;
        }
    }

    return (
        <div>
            {currentApp}
            <LeftNav username={username.current} serverIP="54.159.145.255" setApp={goToPage.bind(this)}/>
        </div>
    )
}

export default App