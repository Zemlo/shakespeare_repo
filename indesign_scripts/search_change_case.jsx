﻿/*
	Search and change case
	Version: 1.5
	
    Script by Thomas Silkjær
	http://indesigning.net/
*/

var the_document = app.documents.item(0);

// Create a list of character styles
var list_of_character_styles = the_document.characterStyles.everyItem().name;
list_of_character_styles.unshift("No!")

// Make the dialog box for the change case search
var the_dialog = app.dialogs.add({name:"Change case"});
with(the_dialog.dialogColumns.add()){
	with(dialogRows.add()){
		staticTexts.add({staticLabel:"Search for (GREP):"});
		var grep_string = textEditboxes.add({minWidth:200});
	}
	with(dialogRows.add()){
		staticTexts.add({staticLabel:"Change case to:"});
		var change_case_to_text = dropdowns.add({stringList:["UPPERCASE","lowercase","Title Case","Sentence case"], selectedIndex:0});
	}
	with(dialogRows.add()){
		staticTexts.add({staticLabel:"Apply character style?"});
		var apply_cstyle = dropdowns.add({stringList:list_of_character_styles, selectedIndex:0});
	}
	with(dialogRows.add()){
		staticTexts.add({staticLabel:"Apply local formatting?"});
		var local_formatting = dropdowns.add({stringList:["No!","OT All Small Caps","Small Caps"], selectedIndex:0});
	}
	with(dialogRows.add()){
		staticTexts.add({staticLabel:"Search:"});
		var search_in = dropdowns.add({stringList:["Story","Document"], selectedIndex:0});
	}
}
the_dialog.show();

//Define change_case_to
if(change_case_to_text.selectedIndex == 0) {
	change_case_to = ChangecaseMode.UPPERCASE;
} else if(change_case_to_text.selectedIndex == 1) {
	change_case_to = ChangecaseMode.LOWERCASE;
} else if(change_case_to_text.selectedIndex == 2) {
	change_case_to = ChangecaseMode.TITLECASE;
} else {
	change_case_to = ChangecaseMode.SENTENCECASE;
}

// Set find grep preferences to find text with the grep value entered in the dialog
app.findChangeGrepOptions.includeFootnotes = false;
app.findChangeGrepOptions.includeHiddenLayers = false;
app.findChangeGrepOptions.includeLockedLayersForFind = false;
app.findChangeGrepOptions.includeLockedStoriesForFind = false;
app.findChangeGrepOptions.includeMasterPages = false;

app.findGrepPreferences = NothingEnum.nothing;
app.findGrepPreferences.findWhat = grep_string.editContents;

// Search
if(search_in.selectedIndex == 0) {
	var the_story = app.selection[0].parentStory;
	var found_texts = the_story.findGrep();
} else {
	var found_texts = the_document.findGrep();
}

// Loop through found text and change the case, apply local formatting and character styles
if(found_texts.length != 0) {
	for (i=0;i<found_texts.length;i++) {
  		found_texts[i].changecase(change_case_to);
		
		if(local_formatting.selectedIndex == 1) {
			found_texts[i].capitalization = Capitalization.CAP_TO_SMALL_CAP;
		} else if(local_formatting.selectedIndex == 2) {
			found_texts[i].capitalization = Capitalization.SMALL_CAPS;
		}
		
		if(apply_cstyle.selectedIndex != 0) {
			var the_cstyle = the_document.characterStyles.item(apply_cstyle.selectedIndex-1);
			found_texts[i].appliedCharacterStyle = the_cstyle;
		}
	}
	alert("Done changing cases! "+found_texts.length+" places found.");
} else {
	alert("No matches found!");
}