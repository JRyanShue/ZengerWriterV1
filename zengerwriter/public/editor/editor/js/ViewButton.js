
import { UIPanel, UIViewButton, UIViewButtonInner } from './libs/ui.js';

// Toggles the view between part view and layer view

function ViewButton( editor, name, viewSelection, handleClick ) {

    var select = viewSelection.select;

    // Panel: not selectable
    var container = new UIPanel();

    // ViewButton: basic styles
	var viewButton = new UIViewButton();

    // ViewButtonInner: additional styles based on selected/unselected. 
    this.viewButtonInner = new UIViewButtonInner( false );


	this.viewButtonInner.dom.innerHTML = name;
    this.viewButtonInner.dom.onclick = () => {
        
        // Select this button ( highlight it on the screen )
        select( this );
        handleClick(); 

    }

    this.select = () => {

        this.viewButtonInner.dom.className = 'selected';

    }

    this.deselect = () => {

        this.viewButtonInner.dom.className = 'unselected';
        
    }


    viewButton.add( this.viewButtonInner )
	container.add( viewButton );


    viewSelection.viewButtons.push( this );
    return container;

}

export { ViewButton }