
import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';
import { SettingButton } from './SettingDisplay.js';

function MenubarShell( editor ) {

	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/shell' ) );
	container.add( title );

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// Layer Height
	options.add( new SettingButton( editor, "layer_height" ) );

	//

	options.add( new UIHorizontalRule() );

	// Line Width
	options.add( new SettingButton( editor, "line_width" ) );

	return container;

}

export { MenubarShell };
