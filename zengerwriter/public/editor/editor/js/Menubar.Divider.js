
import { UIPanel, UIVerticalRule } from './libs/ui.js';

function MenubarDivider ( editor ) {

    // var strings = editor.strings;

	var container = new UIPanel();
    container.setClass( 'menu' );

    // var options = new UIPanel();
	// options.setClass( 'options' );
	// container.add( options );

    container.add( new UIVerticalRule() );

    return container; 

}

export { MenubarDivider }