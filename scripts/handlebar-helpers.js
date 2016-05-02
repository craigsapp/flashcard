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
	if (!url) {
		return "";
	}
	if (url.match(/^\s*$/)) {
		return "";
	}

	var matches;
	var md5sum;
   var first;
   var second;
   var filename;
	if (matches = url.match(/^wiki:\s*(.*)\s*/)) {
	   // @AUDIO:			https://upload.wikimedia.org/wikipedia/commons/e/ec/Pl-dwa.ogg
	   // @WIKIAUDIO:		Pl-dwa.ogg
		filename = matches[1];
		md5sum   = CryptoJS.MD5(filename).toString(CryptoJS.enc.Hex);
		first    = md5sum.substr(0, 1);
		second   = md5sum.substr(0, 2);
		url      = "https://upload.wikimedia.org/wikipedia/commons/" + first + 
			"/" + second + "/" + filename;
	}

	var output = "";

	output += "<audio preload='none' class='audio_volume_only' controls>";
	output += "<source";

	if (url.match(/\.ogg$/)) {
		output += " type='audio/ogg'";
	} else {
		output += " type='audio/mpeg'";
	}
	output += " src='";
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



//////////////////////////////
//
// plural Handlebars helper --
//

Handlebars.registerHelper("plural", function(word) {
	var output = "";
	if (!word) {
		return new Handlebars.SafeString(output);
	}
   output += " / " + word;
	return new Handlebars.SafeString(output);
});



//////////////////////////////
//
// forvo Handlebars helper --
//

Handlebars.registerHelper("forvo", function(word) {
	var output = "";
	if (!word) {
		return new Handlebars.SafeString(output);
	}
   var clean = word.replace(/[.,:;?!]/g, "");
   var words = clean.split(/[.,:]?\s+/);
   if (words.length > 7) {
		return new Handlebars.SafeString(output);
   }
   output += '<div style="position:absolute; right:10px; bottom:0px;">\n';
   for (var i=0; i<words.length; i++) {
		output += '<a target="new" href="http://forvo.com/word/';
		output += words[i] + '/#pl">\n';
		output += '<img width=40 '
		output += 'src=http://static00.forvo.com/_presentation/img/forvo_og.png>\n';
		output += '</a>\n';
   }
   output += '</div>\n';
	return new Handlebars.SafeString(output);
});



