// ==UserScript==
// @name        colorize chat
// @namespace   joshleblanc94@gmail.com
// @include     http://chat.stackoverflow.com/rooms/*
// @version     1
// @grant       none
// ==/UserScript==

function exec(fn) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = '(' + fn + ')()';
  document.body.appendChild(script);
}



exec(function() {		
	var sheet;

	function toColor(num) {
		num >>>= 0;
		var b = num & 0xFF,
				g = (num & 0xFF00) >>> 8,
				r = (num & 0xFF0000) >>> 16;
		return "rgb(" + [r, g, b].join(",") + ")";
	}

	function ruleMaker(s, color) {
		return "." + s + " .messages " + " { box-shadow: 0px -4px " + color + " }";
	}	
	
	function createStyleSheet() {
		var style = document.createElement("style");
		document.head.appendChild(style);
		sheet = style.sheet;

		JSON.parse(localStorage.getItem("user-styles")).forEach(s => {
			var color = toColor(s.split("user-")[1]);
			sheet.insertRule(ruleMaker(s, color), sheet.cssRules.length);
		});
	}

	function onMutation(mutations) {
		mutations.forEach(mutation => [].forEach.call(mutation.addedNodes, node => {
			if(Array.from(node.classList).includes("user-container")) {
				var user = node.classList[1],
						userStyles = JSON.parse(localStorage.getItem("user-styles"));
				if(!userStyles.includes(user)) {
					userStyles.push(user);
					localStorage.setItem("user-styles", JSON.stringify(userStyles));
					var color = toColor(user.split("user-")[1]);
					sheet.insertRule(ruleMaker(user, color), sheet.cssRules.length);
				}
			}
		}));
	}
	
	if(!localStorage.getItem("user-styles")) {
		localStorage.setItem("user-styles", JSON.stringify([]));
	}
	createStyleSheet();
	var mo = new MutationObserver(onMutation);
	mo.observe(chat, {
		childList: true,
		subtree: true
	});
});