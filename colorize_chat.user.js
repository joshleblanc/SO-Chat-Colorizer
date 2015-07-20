// ==UserScript==
// @name        colorize chat
// @namespace   joshleblanc94@gmail.com
// @include     http://chat.stackoverflow.com/rooms/44914/ruby-sometimes-on-rails
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
	function onMutation(mutations) {
		mutations.forEach(mutation => [].forEach.call(mutation.addedNodes, node => {
			if(Array.from(node.classList).includes("user-container")) {
				var user = node.classList[1];
				var id = user.split("user-")[1];
				var messages = node.querySelector(".messages");
				messages.style["background-color"] = "#" + +id.substring(0,6)/100;
			}
		}));
	}
	var mo = new MutationObserver(onMutation);
	mo.observe(chat, {
		childList: true,
		subtree: true
	});
});