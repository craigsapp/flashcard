//
// Programmer:		Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:	Sat Apr 16 15:12:41 PDT 2016
// Last Modified:	Sun Apr 17 23:32:00 PDT 2016
// Filename:		scripts/cardlist.js
// Web Address:	http://flashcards.sapp.org/scripts/flashcards.js
// Syntax:			JavaScript 1.8/ECMAScript 5
// vim:				ts=3: ft=javascript
//
// Description:   JavaScript management of cardlist database object.
//

// storage for loaded cards:
var CARDLIST = {};
var CATEGORY = "";


//////////////////////////////
//
// randomizeCards -- Shuffle flash cards into a random order.
//

function randomizeCards(list) {
	if (!list) {
		list = CARDLIST.CARD
	}
	var currentIndex = list.length; 
	var temporaryValue;
	var randomIndex;
	while (currentIndex > 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		temporaryValue     = list[currentIndex];
		list[currentIndex] = list[randomIndex];
		list[randomIndex]  = temporaryValue;
	}
	return list;
}



//////////////////////////////
//
// CleanTemplate -- Replace abbreviations in the template.
//

function CleanTemplate(text) {
   var cardlist = CARDLIST;
   if (!text.match(/ABBR@/)) {
		return text;
	}
	var matches;
	while (matches = text.match(/ABBR@([A-Z0-9_-]+)/i)) {
		var parameter = matches[1];
      var value = CARDLIST.ABBR[parameter];
		var regex = new RegExp("ABBR@" +  parameter + "\\b", "g");
		text = text.replace(regex, value);
	}
	return text;
}



//////////////////////////////
//
// GetCardCategories --
//

function GetCardCategories(cardlist) {
	if (!cardlist) {
		cardlist = CARDLIST;
	}
	var cards = cardlist.CARD;
   var output = {};
	for (var i=0; i<cards.length; i++) {
		if (!cards[i].CATEGORY) {
			continue;
		}
		if (cards[i].CATEGORY.match(/^\s*$/)) {
			continue;
		}
		var data = cards[i].CATEGORY.split(/,\s*/);
		for (var j=0; j < data.length; j++) {
         if (!output[data[j]]) {
				output[data[j]] = 1;
			} else {
				output[data[j]]++;
			}
		}
   }
	return output;
}
   


//////////////////////////////
//
// GetCategoryCards --
//

function GetCategoryCards(name, cardlist) {
   if (!cardlist) {
		cardlist = CARDLIST;
	}
	if (!cardlist) {
		return;
	}
	var cards = cardlist.CARD;
	if (!cards) {
		return;
	}
	if (!name) {
		return;
	}
   if (name === "all") {
      return cards;
   }
	name = name.replace(/SINGLEQUOTE/g, "'");
	name = name.replace(/DOUBLEQUOTE/g, "'");
	var output = [];
// ggg
	var regex = new RegExp("\\b" + name + "\\b", "i");
   for (var i=0; i<cards.length; i++) {
		if (!cards[i].CATEGORY) {
			continue;
		}
		if (cards[i].CATEGORY.match(regex)) {
			output.push(cards[i]);
		}
	}
	return output;
}



//////////////////////////////
//
// LoadCategory -- Display cards from selected category on the page.
//

function LoadCategory(name) {
	if (!name) {
		name = CATEGORY;
	}
	if (!name) {
		CATEGORY = "all";
		name = CATEGORY;
	}
   CATEGORY = name;
	name = name.replace(/SINGLEQUOTE/, "'", "g");
	name = name.replace(/DOUBLEQUOTE/, '"', "g");
	var cards = GetCategoryCards(name);
   // CATEGORY = name;
	$('#deck').cycle('destroy');
   ShowCardDeck(cards);
	if (SIDEVIEW == 2) {
		showFaceTwo();
	}
   if (WORDLIST) {
		displayCategoryWordList(CATEGORY);
	}
}



//////////////////////////////
//
// onBefore -- What to do when changing slides in cycle.
//

function onBefore() {
	$(this).parent().find('.current').removeClass('current');
}



//////////////////////////////
//
// onAfter -- What to do when changing slides in cycle.
//

function onAfter() {
	$("document").find('.current').removeClass('current');
	$(this).addClass('current');
	var inputs = document.querySelectorAll("input");
   if (inputs) {
		for (var i=0; i<inputs.length; i++) {
      	inputs.value = "";
   	}
	}
	var quiz = document.querySelector(".current input");
	if (quiz) {
		if (SIDEVIEW) {
  			quiz.focus();
		}
	}
}



//////////////////////////////
//
// showPreviousCard --
//

function showPreviousCard() {
	$('#deck').cycle('prev');
}



//////////////////////////////
//
// showNextCard --
//

function showNextCard() {
	$('#deck').cycle('next');
   var quiznote = document.querySelectorAll(".quiz-note");
	if (quiznote) {
		for (var i=0; i<quiznote.length; i++) {
      	quiznote[i].innerHTML = "";
   	}
	}
}



//////////////////////////////
//
// flipCurrentCard --
//

function flipCurrentCard() {
	$('.card.current').toggleClass('flip');
}



//////////////////////////////
//
// FlipCurrent -- Flip over the currently displaying flashcard.
//   (non-jQuery version of flipcurrentCard()).
//

function FlipCurrent() {
	var current = document.querySelectorAll(".card.current");
	for (var i=0; i<current.length; i++) {
		if (current[i].className.match(/flip/)) {
			current[i].classList.remove("flip");
		} else {
			current[i].classList.add("flip");
		}
	}
}



//////////////////////////////
//
// toggleCategoryDisplay --
//

function toggleCategoryDisplay() {
	$('#categories').fadeToggle();
}




//////////////////////////////
//
// playCurrentCardAudio --
//

function playCurrentCardAudio() {
	var audio = document.querySelector(".current audio");
	if (audio) {
		audio.play();
	}
}



//////////////////////////////
//
// GetCgiParameters -- Returns an associative array containing the
//     page's URL's CGI parameters
//

function GetCgiParameters() {
   var url = window.location.search.substring(1);
   var output = {};
   var settings = url.split('&');
   for (var i=0; i<settings.length; i++) {
      var pair = settings[i].split('=');
      pair[0] = decodeURIComponent(pair[0]);
      pair[1] = decodeURIComponent(pair[1]);
      if (typeof output[pair[0]] === 'undefined') {
         output[pair[0]] = pair[1];
      } else if (typeof output[pair[0]] === 'string') {
         var arr = [ output[pair[0]], pair[1] ];
         output[pair[0]] = arr;
      } else {
         output[pair[0]].push(pair[1]);
      }
   }
   return output;
}



//////////////////////////////
//
// GetCardListTitle -- Return title of the cardlist.
//

function GetCardListTitle(cardlist) {
	if (!cardlist) {
		cardlist = CARDLIST;
	}
	return cardlist.TITLE ? cardlist.TITLE : "";
}



//////////////////////////////
//
// GetCardListTitleUrl -- Return URL for the title of the cardlist.
//

function GetCardListTitleUrl(cardlist) {
	if (!cardlist) {
		cardlist = CARDLIST;
	}
	return cardlist.TITLEURL ? cardlist.TITLEURL : "";
}



//////////////////////////////
//
// GetCardSideTitle -- index from 0.
//

function GetCardSideTitle(index, cardlist) {
	if (!index) {
		index = 0;
	}
	if (!cardlist) {
		cardlist = CARDLIST;
	}

	return cardlist.SIDES.SIDE[index].TITLE ? cardlist.SIDES.SIDE[index].TITLE : "";
}



//////////////////////////////
//
// GetCardOptions -- 
//

function GetCardOptions(cardlist) {
	if (!cardlist) {
		cardlist = CARDLIST;
	}
	return cardlist.OPTIONS ? cardlist.OPTIONS : {};
}



//////////////////////////////
//
// hideCards --
//

function hideCards() {
	var cards = document.querySelector("#cards");
	if (cards) {
		cards.style.visibility = "hidden";
		cards.style.display = "none";
	}
}



//////////////////////////////
//
// showCards --
//

function showCards() {
	var cards = document.querySelector("#cards");
	if (cards) {
		cards.style.visibility = "visible";
		cards.style.display = "block";
	}
}



//////////////////////////////
//
// toggleCards --
//

function toggleCards() {
	var cards = document.querySelector("#cards");
	if (!cards) {
		return;
	}
	if (cards.style.visibility == "hidden") {
		showCards();
	} else {
		hideCards();
	}
}



//////////////////////////////
//
// showCard --
//

function showCard(id, side) {
	console.log("GOING TO SHOW CARD", id, "SIDE", side);
	showCards();
	if (side == 1) {
		showFaceOne();
	} else {
		showFaceTwo();
	}
	var deck = document.querySelectorAll("#deck > li");
	if (!deck) {
		return;
	}
	for (var i=0; i<deck.length; i++) {
		var tid = deck[i].id;
		if (tid == id) {
			deck[i].classList.add("current");
			deck[i].style.display = "block";
		} else {
			deck[i].classList.remove("current");
			deck[i].style.display = "none";
		}
	}
}




