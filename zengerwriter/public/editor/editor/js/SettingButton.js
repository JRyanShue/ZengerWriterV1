
import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

function SettingButton ( editor, settingCategory ) {

    var category = settingCategory.toLowerCase();  // Lowercase version for indexing

    // Settings button (e.g. "Quality Settings")
    var button = new UIRow();
	button.setClass( 'option' );
    button.setTextContent( settingCategory + ' Settings' );

    // button toggles form on/off
    button.onClick( function () {

        document.getElementById("screenBlock").style.display = "block";
        document.getElementById(category + "Form").style.display = "block";        

    })

    return button;
}



function cancel() {
    document.getElementById("screenBlock").style.display = "none";
    document.getElementById(category + "Form").style.display = "none";

    // Revert input to previous settings
    for ( var setting in settings ) {
        document.getElementById(setting + "_field").value = settings[setting];
    }
}

export { SettingButton };