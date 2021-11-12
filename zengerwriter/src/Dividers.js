
import { VerticalRule } from "./vr";

function Dividers() {

    return (
        <div>
            <VerticalRule xloc={"calc(100vw - " + getComputedStyle(document.documentElement).getPropertyValue('--prepare-space') + " - " + getComputedStyle(document.documentElement).getPropertyValue('--queue-space') + ")"}/>
            <VerticalRule xloc={"calc(100vw - " + getComputedStyle(document.documentElement).getPropertyValue('--prepare-space') + ")"}/>
        </div>
    )
}

export { Dividers }