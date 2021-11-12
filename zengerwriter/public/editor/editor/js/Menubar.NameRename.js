
import { UIPanel, UINameRename } from './libs/ui.js';
import { SaveInfo } from './API.js';

function MenubarNameRename ( editor ) {

    // Element in top left of editor that shows the name of the element and allows renaming via input text field

	var container = new UIPanel();
    container.setClass( 'platetitle' );

    container.add( new UINameRename( editor.editorInfo['name'], editor, SaveInfo ) );

    return container; 

}

export { MenubarNameRename }