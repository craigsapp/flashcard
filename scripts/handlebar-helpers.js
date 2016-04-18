//
// Programmer:		Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:	Sun Apr 17 21:50:45 PDT 2016
// Last Modified:	Sun Apr 17 21:50:48 PDT 2016
// Filename:		scripts/handlebar-helpers.js
// Web Address:	http://flashcards.sapp.org/scripts/handlebar-helpers.js
// Syntax:			JavaScript 1.8/ECMAScript 5
// vim:				ts=3: ft=javascript
//
// Description:   Handlebar helpers for templats built into flashcards.
//


//////////////////////////////
//
// hyperlink Handlebars helper --
//

Handlebars.registerHelper("hyperlink", function(text, url, linkadd) {
	if (!text) {
		return "";
	}
	if (!url) {
		return "";
	}
	if (url.match(/^\s*$/)) {
		return "";
	}
	if (text.match(/^\s*$/)) {
		return "";
	}
	var output = "";
	output += "<a target='new'";
	output += " href='";
	output += url;
	if (linkadd) {
		output += linkadd;
	}
	output += "'>";
	output += text;
	output += "</a>";
	return new Handlebars.SafeString(output);
});



//////////////////////////////
//
// audio Handlebars helper --
//

Handlebars.registerHelper("audio", function(url) {
	if (url.match(/^\s*$/)) {
		return "";
	}
	var output = "";
	output += "<audio class='audio_volume_only' controls>";
	output += "<source type='audio/mpeg' src='";
	output += url;
	output += "'></audio>";
	return new Handlebars.SafeString(output);
});



//////////////////////////////
//
// imageorword Handlebars helper --
//

Handlebars.registerHelper("imageorword", function(image, word) {
	var output = "";
	if (!image) {
		output += "<span style='position:relative; top:60px;'>";
		output += word;
		output += "</span>";
		return new Handlebars.SafeString(output);
	}
	output += "<img title='" + word + "'";
	output += " style='margin-top:25px; max-width:450px; max-height:250px;'";
	output += " src='" + image + "'>";
	return new Handlebars.SafeString(output);
});



