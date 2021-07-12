(function() {
	var b = 0;
	var c = [ "webkit", "moz" ];
	for ( var a = 0; a < c.length && !window.requestAnimationFrame; ++a) {
		window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"];
		window.cancelAnimationFrame = window[c[a] + "CancelAnimationFrame"]|| window[c[a] + "CancelRequestAnimationFrame"]
	}
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(h, e) {
			var d = new Date().getTime();
			var f = Math.max(0, 16 - (d - b));
			var g = window.setTimeout(function() {
				h(d + f)
			}, f);
			b = d + f;
			return g
		}
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(d) {
			clearTimeout(d)
		}
	}
}());


function KeyboardInputManager() {
	this.events = {};
	this.listen()
}
KeyboardInputManager.prototype.on = function(a, b) {
	if (!this.events[a]) {
		this.events[a] = []
	}
	this.events[a].push(b)
};
KeyboardInputManager.prototype.emit = function(b, c) {
	var a = this.events[b];
	if (a) {
		a.forEach(function(d) {
			d(c)
		})
	}
};
KeyboardInputManager.prototype.listen = function() {
	var c = this;
	var f = {
		38 : 0,
		39 : 1,
		40 : 2,
		37 : 3,
		75 : 0,
		76 : 1,
		74 : 2,
		72 : 3,
		87 : 0,
		68 : 1,
		83 : 2,
		65 : 3
	};
	document.addEventListener("keydown", function(j) {
		var i = j.altKey || j.ctrlKey || j.metaKey || j.shiftKey;
		var h = f[j.which];
		if (!i) {
			if (h !== undefined) {
				j.preventDefault();
				c.emit("move", h)
			}
			if (j.which === 32) {
				c.restart.bind(c)(j)
			}
		}
	});
	var b = document.querySelector(".retry-button");
	b.addEventListener("click", this.restart.bind(this));
	b.addEventListener("touchend", this.restart.bind(this));
	var g = document.querySelector(".keep-playing-button");
	g.addEventListener("click", this.keepPlaying.bind(this));
	g.addEventListener("touchend", this.keepPlaying.bind(this));
	
	var e, d;
	var a = document.getElementsByClassName("game-container")[0];
	a.addEventListener("touchstart", function(h) {
		if (h.touches.length > 1) {
			return
		}
		e = h.touches[0].clientX;
		d = h.touches[0].clientY;
		h.preventDefault()
	});
	a.addEventListener("touchmove", function(h) {
		h.preventDefault()
	});
	a.addEventListener("touchend", function(j) {
		if (j.touches.length > 0) {
			return
		}
		var i = j.changedTouches[0].clientX - e;
		var l = Math.abs(i);
		var h = j.changedTouches[0].clientY - d;
		var k = Math.abs(h);
		if (Math.max(l, k) > 10) {
			c.emit("move", l > k ? (i > 0 ? 1 : 3) : (h > 0 ? 2 : 0))
		}
	})
};
KeyboardInputManager.prototype.restart = function(a) {
	a.preventDefault();
	this.emit("restart")
};
KeyboardInputManager.prototype.keepPlaying = function(a) {
	a.preventDefault();
	this.emit("keepPlaying")
};
function HTMLActuator() {
	this.tileContainer = document.querySelector(".tile-container");
	this.timeContainer = document.querySelector(".time-container");
	this.scoreContainer = document.querySelector(".score-container");
	this.bestContainer = document.querySelector(".best-container");
	this.messageContainer = document.querySelector(".game-message");
	this.targetContainer = document.querySelector(".target-container");
	this.score = 0
}

//vi
HTMLActuator.prototype.actuate = function(c, b) {
	var a = this;
	a.updateTarget();
	window.requestAnimationFrame(function() {
		a.clearContainer(a.tileContainer);
		c.cells.forEach(function(d) {
			d.forEach(function(e) {
				if (e) {
					a.addTile(e)
				}
			})
		});
		a.updateMoveTime(b.moveTime);
		a.updateScore(b.score);
		a.updateBestScore(b.bestScore);
		if (b.terminated) {
			a.message(b)
		}
	})
};
HTMLActuator.prototype.continueAct = function() {
	this.clearMessage()
};
HTMLActuator.prototype.clearContainer = function(c, b) {
	if (!b) {
		while (c.firstChild) {
			c.removeChild(c.firstChild)
		}
	} else {
		var e = c.querySelectorAll(b);
		if (e != null) {
			for ( var d = 0, a = e.length; d < a; d++) {
				c.removeChild(e[d])
			}
		}
	}
};
HTMLActuator.prototype.addTile = function(e) {
	var c = this;
	var g = document.createElement("div");
	var b = document.createElement("div");
	var a = e.previousPosition || {
		x : e.x,
		y : e.y
	};
	var f = this.positionClass(a);
	var d = [ "tile", "tile-" + e.value, f ];
	if (e.value > window.targetScore) {
		d.push("tile-super")
	}
	this.applyClasses(g, d);
	b.classList.add("tile-inner");
	b.textContent = e.value;
	if (e.previousPosition) {
		window.requestAnimationFrame(function() {
			d[2] = c.positionClass({
				x : e.x,
				y : e.y
			});
			c.applyClasses(g, d)
		})
	} else {
		if (e.mergedFrom) {
			d.push("tile-merged");
			this.applyClasses(g, d);
			e.mergedFrom.forEach(function(h) {
				c.addTile(h)
			})
		} else {
			d.push("tile-new");
			this.applyClasses(g, d)
		}
	}
	g.appendChild(b);
	this.tileContainer.appendChild(g)
};
HTMLActuator.prototype.applyClasses = function(b, a) {
	b.setAttribute("class", a.join(" "))
};
HTMLActuator.prototype.normalizePosition = function(a) {
	return {
		x : a.x + 1,
		y : a.y + 1
	}
};
HTMLActuator.prototype.positionClass = function(a) {
	a = this.normalizePosition(a);
	return "tile-position-" + a.x + "-" + a.y
};
HTMLActuator.prototype.updateClassName = function(b, a) {
	if (a >= 100000) {
		b.classList.remove("num-10000");
		b.classList.add("num-100000")
	} else {
		if (a >= 10000) {
			b.classList.remove("num-1000");
			b.classList.add("num-10000")
		} else {
			if (a > 1000) {
				b.classList.add("num-1000")
			}
		}
	}
};

//vp
HTMLActuator.prototype.updateTarget = function() {
	if (!this.targetContainer.getAttribute("data-inited")) {
		this.updateClassName(this.targetContainer, window.targetScore);
		this.timeContainer.getElementsByClassName("x-the-num")[0].textContent = window.targetScore;
		this.targetContainer.setAttribute("data-inited", 1)
	}
};
HTMLActuator.prototype.updateMoveTime = function(a) {
	this.updateClassName(this.timeContainer, a);
	this.timeContainer.getElementsByClassName("x-the-num")[0].textContent = a
};
HTMLActuator.prototype.updateScore = function(b) {
	this.clearContainer(this.scoreContainer, "div.score-addition");
	var c = b - this.score;
	this.score = b;
	this.updateClassName(this.scoreContainer, b);
	this.scoreContainer.getElementsByClassName("x-the-num")[0].textContent = this.score;
	if (c > 0) {
		var a = document.createElement("div");
		a.classList.add("score-addition");
		a.textContent = "+" + c;
		this.scoreContainer.appendChild(a)
	}
};
HTMLActuator.prototype.updateBestScore = function(a) {
	this.updateClassName(this.bestContainer, a);
	this.bestContainer.getElementsByClassName("x-the-num")[0].textContent = a
};


HTMLActuator.prototype.message = function(a) {
	if (a.fromLS) {
		a.won = true
	}
	var b = a.won ? "game-won" : "game-over";
	var c = a.won ? "挑战成功，快分享给微信好友们炫耀一下吧" : "挑战失败，分享出去和微信好友们比一比吧";
	if (a.over) {
		if (a.won) {
			c = "虽败犹荣，你已经超越调整目标，去朋友圈炫耀下吧"
		}
		b = "game-over"
	}
	if (a.fromLS) {
		c = ""
	} else {
		this.messageContainer.classList.add("msg-animation")
	}
	this.messageContainer.classList.add(b);
	this.messageContainer.getElementsByTagName("p")[0].textContent = c
};
HTMLActuator.prototype.clearMessage = function() {
	this.messageContainer.classList.remove("game-won");
	this.messageContainer.classList.remove("game-over");
	this.messageContainer.classList.remove("msg-animation")
};
HTMLActuator.prototype.convertAsImage = function(d) {
	var a = this;
	var b = this.messageContainer.style.display;
	this.messageContainer.style.display = "none";
	var c = document.getElementById("screenShotContainer");
	html2canvas(c, {
		height : c.offsetHeight,
		onrendered : function(e) {
			var f = e.toDataURL("image/jpeg", 0.6);
			a.messageContainer.style.display = b;
			d && d(f)
		}
	})
};
function Grid(a) {
	this.size = a;
	this.cells = [];
	this.build()
}
Grid.parse = function(f) {
	var d = new Grid(f.size);
	d.cells = [];
	var c = f.cells.length;
	for ( var b = 0; b < c; b++) {
		var g = [];
		for ( var a = 0; a < c; a++) {
			var e = f.cells[b][a];
			if (e) {
				e = Tile.parse(e.x, e.y, e.value, e.previousPosition,
						e.mergedFrom)
			}
			g.push(e)
		}
		d.cells.push(g)
	}
	return d
};
Grid.prototype.build = function() {
	for ( var a = 0; a < this.size; a++) {
		var b = this.cells[a] = [];
		for ( var c = 0; c < this.size; c++) {
			b.push(null)
		}
	}
};
Grid.prototype.randomAvailableCell = function() {
	var a = this.availableCells();
	if (a.length) {
		return a[Math.floor(Math.random() * a.length)]
	}
};
Grid.prototype.availableCells = function() {
	var a = [];
	this.eachCell(function(b, d, c) {
		if (!c) {
			a.push({
				x : b,
				y : d
			})
		}
	});
	return a
};
Grid.prototype.eachCell = function(c) {
	for ( var a = 0; a < this.size; a++) {
		for ( var b = 0; b < this.size; b++) {
			c(a, b, this.cells[a][b])
		}
	}
};
Grid.prototype.cellsAvailable = function() {
	return !!this.availableCells().length
};
Grid.prototype.cellAvailable = function(a) {
	return !this.cellOccupied(a)
};
Grid.prototype.cellOccupied = function(a) {
	return !!this.cellContent(a)
};
Grid.prototype.cellContent = function(a) {
	if (this.withinBounds(a)) {
		return this.cells[a.x][a.y]
	} else {
		return null
	}
};
Grid.prototype.insertTile = function(a) {
	this.cells[a.x][a.y] = a
};
Grid.prototype.removeTile = function(a) {
	this.cells[a.x][a.y] = null
};
Grid.prototype.withinBounds = function(a) {
	return a.x >= 0 && a.x < this.size && a.y >= 0 && a.y < this.size
};
function Tile(a, b) {
	this.x = a.x;
	this.y = a.y;
	this.value = b || 2;
	this.previousPosition = null;
	this.mergedFrom = null
}
Tile.parse = function(a, f, c, b, d) {
	var e = new Tile({}, null);
	e.x = a;
	e.y = f;
	e.value = c;
	e.previousPosition = b;
	e.mergedFrom = d;
	return e
};
Tile.prototype.savePosition = function() {
	this.previousPosition = {
		x : this.x,
		y : this.y
	}
};
Tile.prototype.updatePosition = function(a) {
	this.x = a.x;
	this.y = a.y
};


//vi
window.fakeStorage = {
	_data : {},
	setItem : function(b, a) {
		return this._data[b] = String(a)
	},
	getItem : function(a) {
		return this._data.hasOwnProperty(a) ? this._data[a] : undefined
	},
	removeItem : function(a) {
		return delete this._data[a]
	},
	clear : function() {
		return this._data = {}
	}
};
function LocalStorageManager() {   
	var a = this.localStorageSupported();
	this.storage = a ? window.localStorage : window.fakeStorage
}
LocalStorageManager.prototype.localStorageSupported = function() {
	var c = "test";
	var b = window.localStorage;
	try {
		b.setItem(c, "1");
		b.removeItem(c);
		return true
	} catch (a) {
		return false
	}
};
LocalStorageManager.prototype.get = function(a) {
	try {
		return this.storage.getItem(a)
	} catch (b) {
		return null
	}
};
LocalStorageManager.prototype.set = function(a, c) {
	try {
		this.storage.setItem(a, c)
	} catch (b) {
	}
};
function GameManager(a) {
	this.size = a;
	this.inputManager = new KeyboardInputManager();
	this.lsManager = new LocalStorageManager();
	this.actuator = new HTMLActuator();
	this.startTiles = 2;
	this.bestScoreKey = "bestScore";
	this.metaKey = "metaScore";
	this.biggestMerged = 0;
	this.fromLS = false;
	this.inputManager.on("move", this.move.bind(this));
	this.inputManager.on("restart", this.restart.bind(this));
	this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
	this.setup()
}
GameManager.prototype.restart = function() {
	if (this.fromLS) {
		this.fromLS = false
	}
	this.actuator.continueAct();
	this.lsManager.set(this.metaKey, null);
	this.setup()
};
GameManager.prototype.keepPlaying = function() {
	this.keepPlaying = true;
	this.actuator.continueAct()
};
GameManager.prototype.isGameTerminated = function() {
	return this.over
};
GameManager.prototype.setup = function() {
	var a = this.getLastTimeMetaData();
	if (a) {
		this.init(a.grid, a.metadata);
		this.restoreFromLastTime()
	} else {
		this.init();
		this.addStartTiles();
		this.actuate()
	}
};
GameManager.prototype.init = function(b, a) {
	if (!b || !a) {
		b = new Grid(this.size);
		a = {
			score : 0,
			over : 0,
			won : false,
			moveTime : 0,
			biggestMerged : 0,
			bestScore : this.lsManager.get(this.bestScoreKey),
			terminated : false
		}
	}
	this.grid = Grid.parse(b);
	this.moveTime = a.moveTime;
	this.score = a.score;
	this.over = a.over;
	this.won = a.won;
	this.biggestMerged = parseInt(a.biggestMerged, 10) || 0;
	this.keepPlaying = a.keepPlaying
};
GameManager.prototype.getLastTimeMetaData = function() {
	var b = this.lsManager.get(this.metaKey);
	try {
		if (b) {
			return JSON.parse(b)
		}
	} catch (a) {
	}
	return null
};
GameManager.prototype.restoreFromLastTime = function() {
	var a = this.lsManager.get(this.metaKey);
	if (!a) {
		return false
	}
	this.fromLS = true;
	a = JSON.parse(a);
	a.metadata.fromLS = true;
	a.metadata.terminated = true;
	a.metadata.over = 0;
	a.metadata.won = false;
	this.actuator.actuate(a.grid, a.metadata);
	return true
};
GameManager.prototype.addStartTiles = function() {
	for ( var a = 0; a < this.startTiles; a++) {
		this.addRandomTile()
	}
};
GameManager.prototype.addRandomTile = function() {
	if (this.grid.cellsAvailable()) {
		var b = Math.random() < 0.9 ? 2 : 4;
		var a = new Tile(this.grid.randomAvailableCell(), b);
		this.grid.insertTile(a)
	}
};
GameManager.prototype.actuate = function() {
	if (parseInt(this.lsManager.get(this.bestScoreKey) || 0, 10) < this.score) {
		this.lsManager.set(this.bestScoreKey, this.score)
	}
	var a = {
		score : this.score,
		over : this.over,
		won : this.won,
		moveTime : this.moveTime,
		bestScore : this.lsManager.get(this.bestScoreKey),
		biggestMerged : this.biggestMerged,
		terminated : this.isGameTerminated()
	};
	this.actuator.actuate(this.grid, a);
	if (a.terminated) {
		this.lsManager.set(this.metaKey, null)
	} else {
		this.lsManager.set(this.metaKey, JSON.stringify({
			grid : this.grid,
			metadata : a
		}))
	}
	AudioManager.play()
};
GameManager.prototype.getWxShareData = function(b) {
	var a = this;
	this.actuator.convertAsImage(function(d) {
		var c = {
			imgUrl : d,
			link : location.href,
			desc : "我挑战" + window.targetScore + ",移动" + a.moveTime + "次,最大"
					+ a.biggestMerged + ",总分" + a.score + ",记录"
					+ (a.lsManager.get(a.bestScoreKey) || 0),
			title : "快来和我PK数字游戏：" + window.targetScore
		};
		if (/android/i.test(navigator.userAgent)) {
			if (a.cacheData && a.cacheData.dataURI == d) {
				c.imgUrl = a.cacheData.imgUrl;
				b && b(c)
			} else {
				var f = document.querySelector(".mod-loading");
				f.style.display = "block";
				var e = document.querySelector("html").getAttribute(
						"data-app-domain");
				Ajax.post(e + "/demo/submit/createfilebybase64", {
					content : d
				}, function(g) {
					a.cacheData = {
						dataURI : d,
						imgUrl : g.url
					};
					c.imgUrl = g.url;
					f.style.display = "none";
					b && b(c)
				})
			}
		} else {
			b && b(c)
		}
	})
};
GameManager.prototype.prepareTiles = function() {
	this.grid.eachCell(function(a, c, b) {
		if (b) {
			b.mergedFrom = null;
			b.savePosition()
		}
	})
};
GameManager.prototype.moveTile = function(b, a) {
	this.grid.cells[b.x][b.y] = null;
	this.grid.cells[a.x][a.y] = b;
	b.updatePosition(a)
};
GameManager.prototype.move = function(g) {
	var d = this;
	if (this.isGameTerminated()) {
		return
	}
	var a, f;
	var b = this.getVector(g);
	var c = this.buildTraversals(b);
	var e = false;
	this.prepareTiles();
	c.x.forEach(function(h) {
		c.y.forEach(function(l) {
			a = {
				x : h,
				y : l
			};
			f = d.grid.cellContent(a);
			if (f) {
				var j = d.findFarthestPosition(a, b);
				var k = d.grid.cellContent(j.next);
				if (k && k.value === f.value && !k.mergedFrom) {
					var i = new Tile(j.next, f.value * 2);
					i.mergedFrom = [ f, k ];
					d.grid.insertTile(i);
					d.grid.removeTile(f);
					f.updatePosition(j.next);
					d.score += i.value;
					d.biggestMerged = Math.max(d.biggestMerged, i.value);
					if (i.value === window.targetScore) {
						d.won = true
					}
				} else {
					d.moveTile(f, j.farthest)
				}
				if (!d.positionsEqual(a, f)) {
					e = true
				}
			}
		})
	});
	if (e) {
		this.addRandomTile();
		if (!this.movesAvailable()) {
			this.over = true
		}
		this.moveTime++;
		this.actuate()
	}
};
GameManager.prototype.getVector = function(b) {
	var a = {
		0 : {
			x : 0,
			y : -1
		},
		1 : {
			x : 1,
			y : 0
		},
		2 : {
			x : 0,
			y : 1
		},
		3 : {
			x : -1,
			y : 0
		}
	};
	return a[b]
};
GameManager.prototype.buildTraversals = function(a) {
	var b = {
		x : [],
		y : []
	};
	for ( var c = 0; c < this.size; c++) {
		b.x.push(c);
		b.y.push(c)
	}
	if (a.x === 1) {
		b.x = b.x.reverse()
	}
	if (a.y === 1) {
		b.y = b.y.reverse()
	}
	return b
};
GameManager.prototype.findFarthestPosition = function(a, b) {
	var c;
	do {
		c = a;
		a = {
			x : c.x + b.x,
			y : c.y + b.y
		}
	} while (this.grid.withinBounds(a) && this.grid.cellAvailable(a));
	return {
		farthest : c,
		next : a
	}
};
GameManager.prototype.movesAvailable = function() {
	return this.grid.cellsAvailable() || this.tileMatchesAvailable()
};
GameManager.prototype.tileMatchesAvailable = function() {
	var e = this;
	var f;
	for ( var c = 0; c < this.size; c++) {
		for ( var h = 0; h < this.size; h++) {
			f = this.grid.cellContent({
				x : c,
				y : h
			});
			if (f) {
				for ( var g = 0; g < 4; g++) {
					var d = e.getVector(g);
					var b = {
						x : c + d.x,
						y : h + d.y
					};
					var a = e.grid.cellContent(b);
					if (a && a.value === f.value) {
						return true
					}
				}
			}
		}
	}
	return false
};
GameManager.prototype.positionsEqual = function(b, a) {
	return b.x === a.x && b.y === a.y
};
var GameSettings = (function() {
	return {
		init : function() {
			var c = document.getElementById("settingPanel");
			var e = new LocalStorageManager();
			var b = document.getElementById("audioOn");
			var g = "audioOnKey";
			var d = e.get(g);
			b.checked = d == 1;
			var f = document.getElementById("settingEntry");
			f.addEventListener("click", function(h) {
				c.style.display = "block";
				h.preventDefault();
				return false
			}, false);
			var a = document.getElementById("btnConfirm");
			a.addEventListener("click", function(h) {
				e.set(g, b.checked ? 1 : 0);
				c.style.display = "none";
				h.preventDefault();
				return false
			}, false)
		}
	}
})();
var AudioManager = (function() {
	var c = null;
	var a = null;
	var d = function() {
		if (!a) {
			a = document.getElementById("audioOn")
		}
		return a.checked
	};
	var e = function() {
		if (!d()) {
			return
		}
		if (!c) {
			c = document.getElementById("gameAudio")
		}
		c.play()
	};
	var b = function() {
		if (!d()) {
			return
		}
		if (!c) {
			c = document.getElementById("gameAudio")
		}
		if (c.networkState == HTMLMediaElement.NETWORK_IDLE
				&& c.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA) {
			c.pause();
			c.currentTime = 0
		}
	};
	return {
		play : e,
		stop : b
	}
})();
var Ajax = (function() {
	var a = function(b, d, h, g) {
		var f = new XMLHttpRequest();
		f.onreadystatechange = function() {
			if (f.readyState === 4) {
				var i;
				if (f.status === 200 && f.responseText) {
					i = new Function("return " + f.responseText)()
				}
				g(i)
			}
		};
		f.open(h ? h : "GET", b, true);
		if (h == "POST") {
			f.setRequestHeader("Content-Type",
					"application/x-www-form-urlencoded")
		}
		var e = [];
		for ( var c in d) {
			e.push(c + "=" + encodeURIComponent(d[c]))
		}
		f.send(e.join("&"))
	};
	return {
		get : function(b, c, d) {
			return a(b, c, "GET", d)
		},
		post : function(b, c, d) {
			return a(b, c, "POST", d)
		}
	}
})();
var WeixinManager = (function() {
	var c = null;
	var a = {
		imgUrl : "http://www.baidufe.com/fe/blog/static/img/weixin-qrcode-2.jpg?v=07811234",
		link : "http://www.baidufe.com",
		desc : "大家好，我是Alien，Web前端&Android客户端码农，喜欢技术上的瞎倒腾！欢迎多交流",
		title : "Hi，I'm Alien"
	};
	var b = {
		async : true,
		ready : function() {
			if (this.async) {
				var e = this.dataLoaded || new Function();
				c.getWxShareData(function(f) {
					a = f;
					e(a)
				})
			}
		},
		cancel : function(e) {
		},
		fail : function(e) {
		},
		confirm : function(e) {
		},
		all : function(e) {
		}
	};
	var d = function(e) {
		c = e;
		var g = "winxin://profile/gh_dd4b2c2ada8b";
		var f = document.getElementById("wx_android");
		if ((/Windows\sPhone/i.test(navigator.userAgent))) {
			f.setAttribute("href", g)
		}
		WeixinApi.ready(function(h) {
			h.shareToFriend(a, b);
			h.shareToTimeline(a, b);
			h.shareToWeibo(a, b);
			h.hideToolbar()
		})
	};
	return {
		init : d
	}
})();
window.targetScore = parseInt(
		document.getElementById("game_target").textContent, 10);
if (isNaN(window.targetScore) || window.targetScore < 4) {
	window.targetScore = 2048
}
var gameManager = new GameManager(4);
GameSettings.init();
WeixinManager.init(gameManager);
