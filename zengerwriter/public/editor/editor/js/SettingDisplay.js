
import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

function SettingDisplay( editor, setting, settingVal ) {

    this.setting = setting;  // Keep setting for future reference when altering variable values

    var option = new UIRow();
	option.setClass( 'setting' );
    option.setId( setting + '_display' );

    option.setTextContent( editor.strings.getKey( 'settings/' + setting ) + ": " + settingVal );

    return option;

}

export { SettingDisplay };