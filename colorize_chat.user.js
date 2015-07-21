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
	class Storage {
		constructor() {
			this.length = 0;
			if(!this.get()) {
				this.set([]);
			}
		}
		
		get() {
			return JSON.parse(localStorage.getItem("user-styles"));
		}
	
		push(s) {
			var arr = this.get();
			arr.push(s);
			this.set(arr);
		}
	
		set(s) {
			this.length++;
			localStorage.setItem("user-styles", JSON.stringify(s));
		}
		
		has(s) {
			return this.get().includes(s);
		}
		
	}
	 
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
	
		storage.get().forEach(s => {
			const color = toColor(s.split("user-")[1]);
			sheet.insertRule(ruleMaker(s, color), sheet.cssRules.length);
		});
	}
	function mapcat(a, fn) {
		return [...a].reduce((p, c) => [...p].concat(...fn(c)), fn(a[0]), 0);
	}
	
	function isUserContainer(node) {
		return [...node.classList].includes("user-container");
	}

	function onMutation(mutations) {
		const addedNodes = mapcat(mutations, m => [...m.addedNodes].filter(isUserContainer));
		addedNodes.forEach(n => {
			var user = n.classList[1];
			if(!storage.has(user)) {
				const color = toColor(user.split("user-")[1]);
				storage.push(user);
				sheet.insertRule(ruleMaker(user, color), sheet.cssRules.length);
			}
		});
	}
	
	var sheet;
	var storage = new Storage();
	createStyleSheet();
	new MutationObserver(onMutation).observe(chat, {
		childList: true,
		subtree: true
	});
});