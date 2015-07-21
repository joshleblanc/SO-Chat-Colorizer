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
	
	class User {
		constructor(str) {
			this.id = str.split("user-")[1];
			this.full = str;
			this.color = this.toColor(this.id);
		}
		
		toColor(num) {
			num >>>= 0;
			var b = num & 0xFF,
				g = (num & 0xFF00) >>> 8,
				r = (num & 0xFF0000) >>> 16;
			return "rgb(" + [r, g, b].join(",") + ")";
		}
	}
	 
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
			const arr = this.get();
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
	 
	class Watcher {
		constructor(el) {
			new MutationObserver(this.onMutation.bind(this)).observe(el, {
				childList: true,
				subtree: true
			});
		}

		isUserContainer(node) {
			return [...node.classList].includes("user-container");
		}

		mapcat(a, fn) {
			return [...a].reduce((p, c) => [...p].concat(...fn(c)), fn(a[0]), 0);
		}

		onMutation(mutations) {
			const addedNodes = this.mapcat(mutations, m => [...m.addedNodes].filter(this.isUserContainer));
			addedNodes.forEach(n => {
				var user = new User(n.classList[1]);
				if(!storage.has(user)) {
					storage.push(user);
					sheet.insertRule(user);
				}
			});
		}
	}
	 
	class HighlightSheet {
		constructor() {
			const style = document.createElement("style");
			document.head.appendChild(style);
			this.sheet = style.sheet;
		}
		
		insertRule(user) {
			this.sheet.insertRule(this.makeRule(user), this.length());
		}

		length() {
			return this.sheet.cssRules.length;
		}
		
		makeRule(user) {
			return "." + user.full + " .messages " + " { box-shadow: 0px -4px " + user.color + " }";
		}	
		massInsert(arr) {
			arr.forEach(s => this.insertRule(s));
		}
	}
	
	const sheet = new HighlightSheet();
	const storage = new Storage();
	const watcher = new Watcher(chat);
	sheet.massInsert(storage.get());

});