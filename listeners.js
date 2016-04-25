//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Sun Apr 17 18:05:09 PDT 2016
// Filename:       listeners.js
// Web Address:    http://flashcards.sapp.org/listeners.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Event listeners and related code for index.html.
//


//////////////////////////////
//
// DOMContentLoaded event listener -- What to do when the page is finished
//     loading.
//

document.addEventListener("DOMContentLoaded", function() {
   // document.querySelector("#categories").addEventListener("click", function() {
	//    $('#categories').fadeToggle();
   // });

	var cgi = GetCgiParameters();
	if (cgi.cards) {
		loadCards(cgi.cards);
	} 
});



//////////////////////////////
//
// keydown event listener --
//

window.addEventListener("keydown", function(event) {
	var CKey      = 67;
	var DKey      = 68;
	var EKey      = 69;
	var FKey      = 70;
	var GKey      = 71;
	var HKey      = 72;
	var IKey      = 73;
	var JKey      = 74;
	var KKey      = 75;
	var LKey      = 76;
	var MKey      = 77;
	var NKey      = 78;
	var OKey      = 79;
	var PKey      = 80;
	var QKey      = 81;
	var RKey      = 82;
	var OneKey    = 49;
	var TwoKey    = 50;
	var LeftKey   = 37;
	var UpKey     = 38;
	var RightKey  = 39;
	var DownKey   = 40;
	var EnterKey  = 13;
	var SpaceKey  = 32;
	var SlashKey  = 191;

   if (event.metaKey) {
		return;
	}

	switch (event.keyCode) {

		case TwoKey:
			showFaceTwo();
			event.preventDefault();
			break;

		case OneKey:
			showFaceOne();
			event.preventDefault();
			break;

		case LeftKey:
			showPreviousCard();
			event.preventDefault();
			break;

		case RightKey:
			showNextCard();
			event.preventDefault();
			break;

		case UpKey:
		case DownKey:
		case EnterKey:
			flipCurrentCard();
			event.preventDefault();
			break;

		case SpaceKey:
			playCurrentCardAudio();
			event.preventDefault();
			break;

		case CKey:
			toggleCategoryDisplay();
			event.preventDefault();
			break;

		case RKey:
			RANDOMIZE = !RANDOMIZE;
			console.log("RAND", RANDOMIZE);
			event.preventDefault();
			break;

	}
});



