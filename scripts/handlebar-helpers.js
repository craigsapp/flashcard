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
   var clean = cleanText(word);
   var words = clean.split(/[\s/]+/);
   if (words.length > 10) {
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



//////////////////////////////
//
// quiz Handlebars helper --
//

Handlebars.registerHelper("quiz", function(object, answertag, title, hidequiz) {
	var output = "";
	if (hidequiz) {
		return new Handlebars.SafeString(output);
	}
	clean = cleanText(object[answertag]);
	var newtag = answertag + "_ALT";
	if (object[newtag]) {
		if (typeof object[newtag] === "string") {
			clean += "; " + cleanText(object[newtag]);
		} else {
			for (var i=0; i<object[newtag].length; i++) {
				clean += "; " + cleanText(object[newtag][i]);
			}
		}
	}

	var side1title = title;
   output += '<div class="quiz">\n';
	output += '<span class="answer"></span>';
   output += '<input type="text" size="40" ';
	output += 'placeholder="Type ' + side1title + ' equivalent here" ';
	output += 'name="' + clean + '" ';
   output += 'onkeyup="checkAnswer(this);">\n';
	output += '<span class="quiz-note"></span>';
   output += '</div>\n';
	return new Handlebars.SafeString(output);
});



//////////////////////////////
//
// ifEqual Handlebars helper -- Boolean compare of two strings
//

Handlebars.registerHelper('ifEqual', function(a, b, opts) {
	if (a === b)  {
		return opts.fn(this);
	} else {
		return opts.inverse(this);
	}
});



//////////////////////////////
//
// ifContains Handlebars helper -- If A contain the substring B, then return true.
//

Handlebars.registerHelper('ifContains', function(a, b, opts) {
	var regex = new RegExp("\\b" + b + "\\b");
	if (a.match(regex)) {
		return opts.fn(this);
	} else {
		return opts.inverse(this);
	}
});



//////////////////////////////
//
// morse Handlebars helper -- Print Morse code dots and dashes nicely.
//

Handlebars.registerHelper("morse", function(morse) {
	if (!morse) {
		return new Handlebars.SafeString("");
	}
   var output = morse.replace(/-]/g, "&ndash;").replace(/\./g, "&middot;");
	return new Handlebars.SafeString(output);
});



//////////////////////////////
//
// paren Handlebars helper -- Print field in parentheses or other prefix/suffix.
//

Handlebars.registerHelper("paren", function(text, prefix, suffix) {
	if (!text) {
		return new Handlebars.SafeString("");
	}
   if (text.match(/^\s*$/)) {
		return new Handlebars.SafeString("");
	}
	if (typeof prefix !== "string") {
		prefix = "(";
	}
	if (typeof suffix !== "string") {
		suffix = ")";
	}
   var output = prefix + text + suffix;
	return new Handlebars.SafeString(output);
});



//////////////////////////////
//
// worddlistcell Handlebars helper -- For printing word list cell contents.
//

Handlebars.registerHelper("wordlistcell", function(template, that) {
	if (!template) {
		return new Handlebars.SafeString("");
	}

   template = CleanTemplate(template);
   var templatefunction = Handlebars.compile(template);
	var output = templatefunction(that);
	return new Handlebars.SafeString(output);
});



//////////////////////////////
//
// vspace Handlebars helper -- For printing vertical spacer.
//

Handlebars.registerHelper("vspace", function(vspace) {
	if (!vspace) {
		return new Handlebars.SafeString("");
	}

	var output = "<div style='margin-top:";
	output += vspace;
 	output += "'></div>";
	return new Handlebars.SafeString(output);
});




