
import { UIPanel, UIDiv, UIInput } from './libs/ui.js';


class LayerSlider extends UIPanel {

    constructor() {

        super();

        this.dom.id = 'LayerSlider';

    }

}

class LayerSelectionArea extends UIPanel {

    constructor() {

        super();

        this.top = 0;
        this.bottom = 0;

        this.dom.id = 'LayerSelectionArea';

        this.update();

    }

    update( topbottom ) {

        if ( topbottom ) {
            if ( topbottom['top'] ) {
                this.top = topbottom['top'];
            }
            if ( topbottom['bottom'] ) {
                this.bottom = topbottom['bottom'];
            }        
        }

        console.log( this.top, this.bottom )
        this.setTop( this.top );
        this.setBottom( this.bottom );

    }

    // Update CSS
    setTop() {

        this.dom.style.top = String(this.top) + 'px';

    }

    // Update CSS
    setBottom() {

        this.dom.style.bottom = 'calc( 100vh - ' + String(this.bottom) + 'px )';

    }

}

class LayerSelectionBall extends UIDiv {

    constructor( layerSelection ) {

        super();

        this.layerSelection = layerSelection;
        this.layerSlider = layerSelection.layerSlider;
        
        this.dom.className = 'Ball';

        this.dom.draggable = true;

        this.origin = 0;
        this.relY = 0;
        this.y = 0;
        this.dY = 0;
        this.cursorLastY;

        this.minY;
        this.maxY;

        this.handleDrag = () => {};  // Set by external code
        this.handleMove = () => {};  // Set within this class

        this.handleSelect = () => {};  // Set by external code

        this.dom.onpointerdown = (e) => {

            e.preventDefault();
            this.activate();
            this.cursorLastY = e.y;

            window.onpointermove = (e) => {

                this.handleMove(e);

            }

        }

        window.addEventListener( 'pointerup', (e) => {  // Must be a listener, otherwise functions will override each other

            e.preventDefault();
            this.handleMove = () => {};

        } )

        this.dom.onpointermove = () => {};

    }


    // Allows balls to be moved (activated when they are pressed)
    activate() {

        this.handleSelect();

        this.handleMove = (e) => {

            this.dY = e.y - this.cursorLastY;
            this.y += this.dY;

            // Enforce bounds
            if ( this.y < this.minY ) {

                this.y = this.minY;

            } else if ( this.y > this.maxY ) {

                this.y = this.maxY;

            } else {

                this.cursorLastY = e.y;

            }

            console.log( this.y )
            this.render();

            // Update parent element
            this.layerSelection.updateSelection();

            this.handleDrag(e);

        }

    }

    move() {



    }


    // Distance is absolute postition from the top of the document
    render() {

        console.log('calc( ' + String(this.y) + 'px' + ' - ' + getComputedStyle( this.dom ).getPropertyValue('--diameter') + '/2)')
        this.dom.style.top = 'calc( ' + String(this.y) + 'px' + ' - ' + getComputedStyle( this.dom ).getPropertyValue('--diameter') + '/2)';

    }

    setFromTop( dist ) {

        this.dom.style.top = 'calc(' + getComputedStyle( this.layerSlider.dom ).getPropertyValue('--top-distance') + ' + ' + String(dist) + 'px' + ' - ' + getComputedStyle( this.dom ).getPropertyValue('--diameter') + '/2)';
        this.y = this.computeCenter()['y'];

        this.origin = this.y;

        // Set bounds
        this.minY = this.origin;
        this.maxY = this.origin + 100;

    }

    // Convert bottom position into top position
    setFromBottom( dist ) {

        this.dom.style.bottom = 'calc(' + getComputedStyle( this.layerSlider.dom ).getPropertyValue('--topbottom-distance') + ' + ' + String(dist) + 'px' + ' - ' + getComputedStyle( this.dom ).getPropertyValue('--diameter') + '/2)';
        var distFromTop = String( this.dom.getBoundingClientRect().top ) + 'px';
        
        this.dom.style.removeProperty( 'bottom' );
        this.dom.style.top = distFromTop;
        
        this.y = this.computeCenter()['y'];

        this.origin = this.y;

        // Set bounds
        this.maxY = this.origin;
        this.minY = this.origin - 100;

    }

    computeCenter() {

        var rect = this.dom.getBoundingClientRect();
        return {
            'x': (rect.left + rect.right)/2,
            'y': (rect.top + rect.bottom)/2
        }

    }

}

class BallLocLabel extends UIInput {

    constructor( y ) {

        super( y );

        this.y = y;

        this.dom.className = 'BallLocLabel'

        // this.dom.style.width = 'max-content'

        this.dom.size = 3;

    }

    setY( y ) {

        this.y = y

        this.dom.style.top = 'calc(' + getComputedStyle( this.layerSlider.dom ).getPropertyValue('--top-distance') + ' + ' + String(dist) + 'px' + ' - ' + getComputedStyle( this.dom ).getPropertyValue('--diameter') + '/2)';

    }

}

class TopBall extends UIDiv {

    constructor() {

        super();

        this.dom.id = 'TopBall';

    }

}

class BottomBall extends UIDiv {

    constructor() {

        super();

        this.dom.id = 'BottomBall';

    }

}

export { LayerSlider, LayerSelectionArea, LayerSelectionBall, BallLocLabel, TopBall, BottomBall }