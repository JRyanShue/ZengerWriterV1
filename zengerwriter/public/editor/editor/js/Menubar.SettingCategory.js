
import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';
import { SettingDisplay } from './SettingDisplay.js';
import { SettingButton } from './SettingButton.js';
import { addProgrammaticBackspace } from './libs/ProgrammaticBackspace.js';
import { SaveInfo } from './API.js';

function MenubarSettingCategory( editor, settingCategory ) {

	this.settingCategory = settingCategory;

	var category = settingCategory.toLowerCase();  // Lowercase version for indexing

	var strings = editor.strings;

	// Initialize referenced form
    createForm( editor, settingCategory );

	// Base (label based on category)
	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/' + category ) );
	container.add( title );

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// Settings button
	container.onClick( function() {

		document.getElementById("screenBlock").style.display = "block";
        document.getElementById(category + "Form").style.display = "block"; 

	})

	// Add setting labels
    for ( var setting in editor.settings.dict[ category ] ) {

        options.add( new SettingDisplay( editor, setting, editor.settings.dict[ category ][ setting ] ) );

    }

	return container;

}

function createForm( editor, settingCategory ) {

    var category = settingCategory.toLowerCase();  // Lowercase version for indexing

    // createBase();
    let settingsForm = document.createElement("div");
    settingsForm.className = "settings-form";
    settingsForm.id = category + "Form";

    let formContainer = document.createElement("div");
    formContainer.className = "form-container"

    // Relies on the setting category being modified
    let formTitle = document.createElement("h1");
    formTitle.innerHTML = "Modify " + settingCategory + " Settings";

    // X button
    var x = document.createElement("span");
    x.innerText = "x";
    x.className = "close";

    x.addEventListener("click", function() {

        document.getElementById("screenBlock").style.display = "none";
        document.getElementById(category + "Form").style.display = "none";

        // Revert input to previous settings
        for ( var setting in settings ) {

            document.getElementById(setting + "_field").value = settings[setting];

        }

    })
    formTitle.append(x);

    // Add to container
    formContainer.appendChild(formTitle);

    // Add all settings for given category
    var settings = editor.settings.dict[category];

    for ( var setting in settings ) {

        let settingTitle = document.createElement("label");
        settingTitle.id = setting + "_label";
        settingTitle.innerText = editor.strings.getKey("settings/" + setting);
        let settingField = document.createElement("input");
        settingField.id = setting + "_field";
        settingField.type = "text";
        settingField.value = settings[setting];

        // Programmatic Backspace
		addProgrammaticBackspace( settingField );

        // Add to container
        formContainer.appendChild(settingTitle);
        formContainer.appendChild(settingField);

    }

    // Newline
    formContainer.appendChild( document.createElement("br") );

    // Cancel Button
    let formCancel = document.createElement("button");
    formCancel.innerText = "Cancel";
    formCancel.className = "setting-button"

    formCancel.addEventListener("click", function() {

        document.getElementById("screenBlock").style.display = "none";
        document.getElementById(category + "Form").style.display = "none";

        // Revert input to previous settings
        for ( var setting in settings ) {

            document.getElementById(setting + "_field").value = settings[setting];

        }

    })

    formContainer.appendChild( formCancel );

    let formSubmit = document.createElement("button");
    formSubmit.innerText = "Apply";
    formSubmit.className = "setting-button"

    formSubmit.addEventListener("click", function() {

        document.getElementById("screenBlock").style.display = "none";
        document.getElementById(category + "Form").style.display = "none";

        // Initialize parent object if it doesn't already exist
        editor.editorInfo[category] = editor.editorInfo[category] || {}

        // Set variables
        for ( var setting in settings ) {

            editor.editorInfo[category][setting] = settings[setting] = document.getElementById(setting + "_field").value;
            
            // Update display values
            document.getElementById( setting + '_display' ).innerText = editor.strings.getKey( 'settings/' + setting ) + ": " + settings[setting];
        
        }

        SaveInfo( editor.editorInfo, editor );

        console.log(editor.editorInfo)
        
    });

    formContainer.appendChild(formSubmit);

    // Apply settings with "enter" key, escape from form with "escape" key
    document.addEventListener( 'keydown', ( e ) => { 

        if ( document.getElementById(category + "Form").style.display == 'block' ) {

            if ( e.key == "Enter" ) {

                formSubmit.click();

            }
            else if ( e.key == "Escape" ) {

                formCancel.click();
            }

        }
        
    } )

    // Add container
    settingsForm.appendChild(formContainer);

    // Add complete form
    document.body.append(settingsForm);

}

export { MenubarSettingCategory };
