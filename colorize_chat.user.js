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
	function toColor(num) {
		num >>>= 0;
		var b = num & 0xFF,
			g = (num & 0xFF00) >>> 8,
			r = (num & 0xFF0000) >>> 16;
		return "rgba(" + [r, g, b, 100].join(",") + ")";
	}
	
	function isTooDark(num) {
		num >>>= 0;
		var b = num & 0xFF,
			g = (num & 0xFF00) >>> 8,
			r = (num & 0xFF0000) >>> 16;
		return (b + g + r) < 255;
	}
	
	function onMutation(mutations) {
		mutations.forEach(mutation => [].forEach.call(mutation.addedNodes, node => {
			if(Array.from(node.classList).includes("user-container")) {
				var user = node.classList[1];
				var id = user.split("user-")[1];
				var messages = node.querySelector(".messages");
				var color = +id.substring(0,6);
				console.log(color);
				messages.style["background-color"] = toColor(color);
				if(isTooDark(color)) {
					messages.style.color = "white";
				}
				
			}
		}));
	}
	var mo = new MutationObserver(onMutation);
	mo.observe(chat, {
		childList: true,
		subtree: true
	});
});