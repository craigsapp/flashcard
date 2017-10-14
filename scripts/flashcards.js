//
// Programmer:		Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:	Sat Apr 16 15:12:41 PDT 2016
// Last Modified:	Sun Apr 17 22:00:11 PDT 2016
// Filename:		scripts/flashcards.js
// Web Address:	http://flashcards.sapp.org/scripts/flashcards.js
// Syntax:			JavaScript 1.8/ECMAScript 5
// vim:				ts=3: ft=javascript
//
// Description:   JavaScript management of flash cards.
//

// Preferred card face to display:
var SIDEVIEW = -1;
var RANDOMIZE = 0;
var WORDLIST = false;


//////////////////////////////
//
// loadCards -- Read the cards from the specified URL (must be a local file).
//

function loadCards(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url);
	request.addEventListener("load", function (event) {
		if (this.readyState == 4) {
			aton = new ATON();
			var data = aton.parse(this.responseText);
			prepareCards(data);
		}
	});
	request.send();
}



//////////////////////////////
//
// prepareCards -- Store the card list in the global location and
//    display the cards.
//

function prepareCards(cardlist) {
	if (!cardlist) {
		console.log("Error, no cards to load");
		return;
	}
	for (var i=0; i<cardlist.CARDLIST.CARD.length; i++) {
		if (!cardlist.CARDLIST.CARD[i]._id) {
			cardlist.CARDLIST.CARD[i]._id = btoa(Math.random()).substring(0, 16);
		}
	}
	var set = cardlist.CARDLIST;
   //if (RANDOMIZE) {
	//	set.CARD = randomizeCards(set.CARD);
	//}
	CARDLIST = set;
	FillCardCategories();
   ShowCardDeck(set.CARD);
	if (CGI.hide == "true") {
		displayCategoryWordList();
	}
	if (CGI.wordlist == "true") {
		displayCategoryWordList();
	}
}



//////////////////////////////
//
// ShowCardDeck --
//

function ShowCardDeck(carddeck) {
	if (!carddeck) {
		console.log("NO CARDS", carddeck);
		return;
	}
	var tempcards = [];
   for (var j=0; j<carddeck.length; j++) {
		tempcards.push(carddeck[j]);
	}
   if (RANDOMIZE) {
		tempcards = randomizeCards(tempcards);
	}
	var deck = document.querySelector("div.deck");
	if (!deck) {
		console.log("Error: no deck div found");
		return;
	}
   var title = GetCardListTitle();
	if (title) {
   	var titleurl = GetCardListTitleUrl();
		var element = document.querySelector("#title");
		if (element) {
			if (titleurl) {
				var output = "";
				output += "<a style='text-decoration:none;";
            if (title.length > 30) {
					output += "letter-spacing:	1px;";
					output += "word-spacing:	1px;";
				}
				output += " cursor:pointer;' target='new' href='";
				output += titleurl;
				output += "'>";
				output += title;
				output += "</a>";
				element.innerHTML = output;
			} else {
				element.innerHTML = title;
			}
		}
	}

	var side1template = CleanTemplate(CARDLIST.SIDES.SIDE[0].TEMPLATE);
	var side2template = CleanTemplate(CARDLIST.SIDES.SIDE[1].TEMPLATE);
	var side1 = Handlebars.compile(side1template);
	var side2 = Handlebars.compile(side2template);
	var output = "";
	output += '<div class="deck">\n';
	output += '<ul id="deck">\n';
	for (var i = 0; i<tempcards.length; i++) {
		output += printCard(tempcards[i], side1, side2);
	}
	output += '</ul>\n';
	output += '</div>\n';
	deck.innerHTML = output;

   $('#deck').cycle({
      after:   onAfter,
      before:  onBefore,
      fx:      'shuffle',
      next:    '#next',
      prev:    '#prev',
      shuffle: {
        top:   -300,
        left:  20
      },
      speed:   'fast',
      timeout: 0,
	});

	ApplyCardOptions();
}



//////////////////////////////
//
// ApplyCardOptions --
// 
// Known options:
// 
// BACKGROUND == background color of page
// CATEGORY_BACKGROUND == background color of category list
// DEFAULT_SIDE == default side of cards to start displaying (0=front, 1=back)
// STYLE == new style element
//

function ApplyCardOptions() {
	var options = GetCardOptions();
   if ((SIDEVIEW < 0) && options.DEFAULT_SIDE) {
		SIDEVIEW = parseInt(options.DEFAULT_SIDE);
		switch(SIDEVIEW) {
			case 0: showFaceOne(); break;
			case 1: showFaceTwo(); break;
		}
	}
	if (options.BACKGROUND) {
		$("body").css("background", options.BACKGROUND);
	}
	if (options.CATEGORY_BACKGROUND) {
		$("#categories").css("background", options.CATEGORY_BACKGROUND);
	}

	if (options.STYLE) {
		var styleNode = document.createElement("style");
		styleNode.innerHTML  = options.STYLE;
		document.body.appendChild(styleNode);
	}

}



//////////////////////////////
//
// printCard -- 
//

function printCard(object, side1, side2) {
	var output = "";
	output += '<li ';
	output += 'id="' + object._id + '" ';
	output += 'class="card">\n';
	output += '<div class="side_one">\n';
	output += '<div class="redline">';
	output += side1(object);
	output += "</div>";
	output += '</div>\n';
	output += '<div class="side_two">\n';
	output += '<div class="redline">';
	output += side2(object);
	output += "</div>";
	output += '</div>\n';
	output += '</li>\n';
	return output;
}



//////////////////////////////
//
// FillCardCategories --
//

function FillCardCategories(cardlist) {
	var catel = document.querySelector("#categories");
   if (!catel) {
		return;
	}
	if (!cardlist) {
		cardlist = CARDLIST;
	}
	var categories = GetCardCategories(cardlist);
	var output = "";
	// output += "<ul>";
   var sum = 0;

   var clist = [];

	for (var prop in categories) {
		if (categories.hasOwnProperty(prop)) {
			if (categories[prop]) {
				sum += categories[prop];
			}
			//if (parseInt(categories[prop]) < 2) {
			//	continue;
			//}
			clist.push(prop);
		}
	}

	clist.sort(function(a, b) {
		return a.localeCompare(b);
	});

	output += "<span class='category'";
	output += " onclick='LoadCategory(\"";
	output += "all" + "\");'" + " >" +  "all";
	output += " (";
	output += CARDLIST.CARD.length;
	output += ")";
	output += "</span> ";

	var count = 0;
	for (var i=0; i<clist.length; i++) {
		count = parseInt(categories[clist[i]]);
		// if (count < 2) {
		//	continue;
		// }
		output += "<span class='category'";
		output += " onclick='LoadCategory(\"";
		output += clist[i].replace(/'/, "SINGLEQUOTE", "g");
		output += "\");'" + " >" +  clist[i];
		output += " (" + categories[clist[i]] + ")";
		output += "</span> ";
	}

	// output += "</ul>";

	// other commands:
	output += "<br><br>";
	output += "<span class='category' onclick='showFaceOne();'>";
	output += GetCardSideTitle(0);
	output += " </a></span> <span onclick='toggleHelpMenu();' class='category help'>?</span>";
	output += "<span class='category' onclick='showFaceTwo();'>";
	output += GetCardSideTitle(1);
	output += " </a></span>";

	catel.innerHTML = output;
}



//////////////////////////////
//
// showFaceTwo --  Display the second side of cards by default.
//

function showFaceTwo() {
	var cards = document.querySelectorAll("#deck li");
	for (var i=0; i<cards.length; i++) {
		cards[i].classList.add("flip");
	}
	SIDEVIEW = 1;
}



//////////////////////////////
//
// showFaceOne --  Display the first side of cards by default.
//

function showFaceOne() {
	var cards = document.querySelectorAll("#deck li");
	for (var i=0; i<cards.length; i++) {
		cards[i].classList.remove("flip");
	}
	SIDEVIEW = 0;
}



//////////////////////////////
//
// displayCategoryWordList --
//

function displayCategoryWordList(name) {
   if (!name) {
      name = CATEGORY;
   }
   if (!name) {
      name = "all";
   }
   var cards = GetCategoryCards(name);
	if (RANDOMIZE) {
		console.log("RANDOMIZING CARDS");
		cards = randomizeCards(cards);
	}
   var wordlist = document.querySelector("#wordlist");
   if (!wordlist) {
      var categories = document.querySelector("#categories");
      if (!categories) {
         console.log("Could not find category list section");
         return;
      }
      var newelement = document.createElement("div");
      newelement.id = "wordlist";
      categories.appendChild(newelement);
      wordlist = newelement;
   }
	var side1value = CARDLIST.SIDES.SIDE[0].WTEMPLATE;
	var side2value = CARDLIST.SIDES.SIDE[1].WTEMPLATE;

   for (var i=0; i<cards.length; i++) {
      cards[i].WORDLIST_SIDE1 = side1value;
      cards[i].WORDLIST_SIDE2 = side2value;
   }

	var wlt = "";
   // wlt += "<h1 style='margin-top:50px;'>Word list</h1>\n";
   wlt += "<table style='margin-top:50px;'>";
	wlt += "{{#each this}}";
	wlt += "<tr><td><span onclick='showCard(\"{{{_id}}}\", 1);'>{{{wordlistcell WORDLIST_SIDE1 this}}}</span></td>";
	wlt += "<td><span onclick='showCard(\"{{{_id}}}\", 2);'>{{{wordlistcell WORDLIST_SIDE2 this}}}</span></td></tr>";
	wlt += "{{/each}}";
	wlt += "</table>";

   var listtable = Handlebars.compile(wlt);
	var output = listtable(cards);
	wordlist.innerHTML = output;
   WORDLIST = true;
}



//////////////////////////////
//
// clearWordlist --
//

function clearWordList() {
	var list = document.querySelector("#wordlist");
	if (list) {
		list.innerHTML = "";
		WORDLIST = false;
	}
}



//////////////////////////////
//
// checkAnswer --
//

function checkAnswer(element) {
   var value = cleanText(element.value);
   var name = cleanText(element.name);
   if (value === name) {
		var parent = element.parentNode;
		var quiznote = parent.querySelector(".quiz-note");
		if (quiznote) {
			quiznote.innerHTML = "Correct!";
		}
      element.value = "";
		setTimeout(function() {
			showNextCard();
		}, 250);
   }
}



//////////////////////////////
//
// toggleHelpMenu --
//

function toggleHelpMenu(state) {
	var help = document.querySelector("#help-container");
   if (!help) {
      return;
   }
   if (typeof state === 'undefined') {
      state = help.style.display === 'none' ? 0 : 1;
   	state = !state;
   }

   if (state) {
		help.style.display = 'block';
   } else {
		help.style.display = 'none';
   }
}



//////////////////////////////
//
// prepareHelpMenu -- Get the file "help.txt" from the server and then
//     fill in the help window with its contents.  Entries in help.txt
//     are in the form:
//         key    [tab]    description
//     other non-blank lines (such as for headings) will be echoed as is.
//

function prepareHelpMenu(selector) {
   var request = new XMLHttpRequest();
   request.open("GET", "/scripts/help.txt");
   request.addEventListener("load", function() {
      fillInHelpContainer(selector, request.responseText);
   });
   request.send();
}



//////////////////////////////
//
// fillInHelpContainer -- Convert the text file with the help
//    contents into a table shown in the help window.
//

function fillInHelpContainer(selector, data) {
   var lines = data.match(/[^\r\n]+/g);
   var help = document.querySelector(selector);
   if (!help) {
		help = document.createElement("DIV");
		help.id = "help-container";
		help.style.display = "none";
		document.body.appendChild(help);
   }
   var output = "";

   output += '<table id="help-table">\n';
   
   var line; 
   for (var i=0; i<lines.length; i++) {
      line = lines[i];
      var matches = line.match(/^\s*(.*)\s*\t\s*(.*)\s*$/);
      if (matches) {
         var key  = matches[1];
         var desc = matches[2];
         output += '<tr><td><b>' 
         output += '<span style="color:#d8ab5c; cursor:pointer;"';
         output += " onclick='processKeyCommand(";
         output += '{keyCode: "' + key + '".charCodeAt(0)}' + ");'";
         output += '>';
         output += key 
         output += '</span>';
         output += '</b></td>';
         output += '<td>' + desc + '</td></tr>';
      } else if (!line.match(/^\s*$/)) {
         output += '<tr><td colspan="2">';
         output += line;
			output += '</td></tr>\n';
      }
   }
   output += '</table>\n';
   help.innerHTML = output;
}



//////////////////////////////
//
// blurText --
//

function blurText() {
   var inputs = document.querySelectorAll("input");
	if (!inputs) {
		return;
	}
	for (var i=0; i<inputs.length; i++) {
		inputs[i].blur();
	}
}



//////////////////////////////
//
// showHint --
//

function showHint(element) {
   if (!element) {
 		return;
	}
	if (element.nodeName !== "INPUT") {
		return;
	}
	var value = element.value;
	var cleanvalue = cleanText(value);
	var name = cleanText(element.name);
	var re = new RegExp("^" + cleanvalue + "(.*)" );
	var matches;
	if (matches = name.match(re)) {
		if (matches[1].length > 0) {
			if (matches[1][0] == " ") {
				value += matches[1][0] + matches[1][1];
			} else {
				value += matches[1][0];
			}
			element.value = value;
		}
	}
}



//////////////////////////////
//
// cleanText --
//

function cleanText(text) {
   if (text.match(/[a-z0-9]/)) {
      // only remove punctuation of there are letters or numbers
      // (this is for the Morse code example)
 		text = text.replace(/[.,:;"()]/g, "");
	}
	text = text.replace(/\s+/g, " ");
	text = text.replace(/^\s+/g, "").replace(/\s+$/, "");
	text = text.toLowerCase();
	return text;
}



