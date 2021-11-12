
import { UIPanel, UIRow, UIElement, UIButton, UIHorizontalRule } from './libs/ui.js';

function PreviewButton( editor ) {

    const IP = editor.IP

    var previewButton = new UIPanel()
    previewButton.setClass( 'menu' )

    var title = new UIPanel()
	title.setClass( 'title' )
	title.setTextContent( 'Print Preview' )
	previewButton.add( title )

    return previewButton

}

export { PreviewButton }
