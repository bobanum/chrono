/*jslint esnext:true, browser:true*/
/*exported App*/
class App {
	get dom() {
		if (!this._dom) {
			this.dom_creer();
		}
		return this._dom;
	}
	static get dom() {
		if (!this._dom) {
			this.dom_creer();
		}
		return this._dom;
	}
	static dom_creer() {
		this._dom = this.dom_interface();
	}
	static dom_interface() {
		var resultat;
		resultat = document.createElement("div");
		resultat.classList.add("interface");
		this.header = resultat.appendChild(this.dom_header(this.dom_menu()));
//		this.body = resultat.appendChild(this.dom_body());
		this.footer = resultat.appendChild(this.dom_footer());
		return resultat;
	}
	static dom_menu() {
		var resultat;
		resultat = document.createElement("ul");
		resultat.classList.add("icones");
		this.modules.forEach(function (m) {
			resultat.appendChild(m.dom_menuItem());

		}, this);
		return resultat;
	}
	static dom_menuItem(label, evts) {
		var resultat, img;
		resultat = document.createElement("li");
		img = resultat.appendChild(document.createElement("span"));
		img.innerHTML = label;
		this.bind(resultat, evts);
		return resultat;
	}
	static dom_bouton(id, value, evts, attributes) {
		var resultat;

		resultat = document.createElement("input");
		resultat.setAttribute("id", id);
		resultat.setAttribute("type", "button");
		resultat.setAttribute("value", value);
		App.bind(resultat, evts);
		App.setAttributes(resultat, attributes);
		return resultat;
	}
	static dom_section() {
		var resultat;
		resultat = document.createElement("section");
		resultat.classList.add("module");
		resultat.appendChild(this.dom_header());
		resultat.appendChild(this.dom_footer());
		resultat.appendChild(this.dom_body());
		resultat.obj = this;
		return resultat;
	}
	static dom_header(contenu) {
		this.header = document.createElement("header");
		if (contenu) {
			this.header.appendChild(contenu);
		}
//		this.header.innerHTML = "dom_header";
		return this.header;
	}
	static dom_footer(contenu) {
		this.footer = document.createElement("footer");
		if (contenu) {
			this.header.appendChild(contenu);
		}
		this.footer.innerHTML = "dom_footer";
		return this.footer;
	}
	static dom_body(contenu) {
		this.body = document.createElement("div");
		this.body.classList.add("body");
		if (contenu) {
			this.header.appendChild(contenu);
		}
		this.body.innerHTML = "dom_body";
		return this.body;
	}
	static dom_select(id, values, evts, selected, attributes) {
		var resultat = document.createElement("select");
		resultat.setAttribute("id", id);
		resultat.setAttribute("name", id);
		if (values instanceof Array) {
			values.forEach(function (e) {
				resultat.appendChild(this.dom_option(e, null, e === selected));
			}, this);
		} else {
			for (let k in values) {
				resultat.appendChild(this.dom_option(k, values[k], k === selected));
			}
		}
		App.bind(resultat, evts);
		App.setAttributes(resultat, attributes);
		return resultat;
	}
	static dom_option(value, label, selected) {
		var resultat = document.createElement("option");
		if (selected) {
			resultat.setAttribute("selected", "selected");
		}
		if (value !== null) {
			resultat.setAttribute("value", value);
		}
		resultat.innerHTML = label;
		return resultat;
	}
	static addDependency(url, attributes) {
		var element, id;
		if (url instanceof Array) {
			url.forEach(function (u) {
				this.addDependency(u,attributes);
			}, this);
			return this;
		}
		id = url.replace(/[^a-zA-Z0-9\_\-\.]/g, "_");
		if (this.dependencies[id] !== undefined) {
			return this.dependencies[id];
		}
		if (url.slice(-3) === ".js") {
			element = document.createElement("script");
			element.setAttribute("src", this.jsUrl(url));
		} else if (url.slice(-4) === ".css") {
			element = document.createElement("link");
			element.setAttribute("href", this.cssUrl(url));
			element.setAttribute("rel", "stylesheet");
		}
		element.setAttribute("id", id);
		this.setAttributes(element, attributes);
		this.dependencies[id] = element;
		document.head.appendChild(element);
		return this.dependencies[id];
	}
	static bind(element, evts) {
		if (!evts) {
			return this;
		}
		for (let k in evts) {
			element.addEventListener(k, evts[k]);
		}
		return this;
	}
	static setAttributes(element, attributes) {
		if (!attributes) {
			return this;
		}
		for (let k in attributes) {
			element.setAttribute(k, attributes[k]);
		}
		return this;
	}
	static dirname(path) {
		if (!path) {
			return ".";
		}
		if (path === ".") {
			return "..";
		}
		if (path === "..") {
			return "/";
		}
		var resultat = path.split(/[\\\/]/g);
		resultat.pop();
		if (!resultat.length) {
			return ".";
		}
		resultat = resultat.join("/");
		return resultat;
	}
	static realpath(url) {
		if (url.match(/^[a-zA-Z0-9]+:\/\//)) {
			return url;
		} else {
			return this.pageUrl(url);
		}
	}
	static setPaths() {
		this._pagePath = this.dirname(location.href);
		this._scriptURL = document.head.lastChild.getAttribute('src');
		this._appPath = this.dirname(this._scriptURL);
		this._appPath = this.realpath(this._appPath);
		this._appPath = this.dirname(this._appPath);	// Pour sortir du dossier "js"
		return this;
	}
	static pageUrl(file) {
		var resultat = this._pagePath;
		if (file) {
			resultat += "/" + file;
		}
		return resultat;
	}
	static appUrl(file) {
		var resultat = this._appPath;
		if (file) {
			resultat += "/" + file;
		}
		return resultat;
	}
	static jsUrl(file) {
		var resultat = this.appUrl("js");
		if (file) {
			if (!file.match(/\.js$/)) {
				file += ".js";
			}
			resultat += "/" + file;
		}
		return resultat;
	}
	static cssUrl(file) {
		var resultat = this.appUrl("css");
		if (file) {
			if (!file.match(/\.css$/)) {
				file += ".css";
			}
			resultat += "/" + file;
		}
		return resultat;
	}
	/**
	 * Retourne un objet contenant les informations et données d'une adresse
	 * @param   {string} url - L'adresse à analyser
	 * @returns {object} - L'objet
	 */
	static parseUrl(url) {
		var resultat;
		resultat = {};
		if (url === undefined) {
			url = window.location.href;
		}
		try {
			url = decodeURI(url);
		} catch (err) {
			url = url;
		}
		url = url.split("?");
		if (url.length > 1) {
			resultat.search = url.splice(1).join("?");
			resultat.data = this.parseSearch(resultat.search);
		}
		url = url[0];
		url = url.split("#");
		if (url.length > 1) {
			resultat.hash = url.splice(1).join("#");
			resultat.refs = resultat.hash.split(',');
		}
		if (url[0]) {
			resultat.href = url[0];
		}
		return resultat;
	}
	/**
	 * Retourne un objet contenant les informations et données d'une adresse
	 * @param   {string} url - L'adresse à analyser
	 * @returns {object} - L'objet
	 */
	static parseSearch(urlSearch) {
		var resultat, donnees, i, n, donnee, cle;
		resultat = {};
		if (urlSearch === undefined) {
			urlSearch = window.location.search;
		}
		if (!urlSearch) {
			return resultat;
		}
		try {
			urlSearch = decodeURI(urlSearch);
		} catch (err) {
			urlSearch = urlSearch;
		}
		if (urlSearch[0] === "?") {
			urlSearch = urlSearch.substr(1);
		}
		if (urlSearch.trim() === "") {
			return resultat;
		}
		donnees = urlSearch.split("&");
		for (i = 0, n = donnees.length; i < n; i += 1) {
			donnee = donnees[i].split("=");
			if (donnee.length === 0) {
				continue;
			}
			cle = donnee.shift();
			donnee = donnee.join("=");
			if (resultat[cle] === undefined) {
				resultat[cle] = donnee;
			} else if (resultat instanceof Array) {
				resultat[cle].push(donnee);
			} else {
				resultat[cle] = [resultat[cle], donnee];
			}
		}
		return resultat;
	}
	static load() {
//		debugger;
		document.body.appendChild(this.dom);
	}
	static init() {
		this.modules = [];
		this.dependencies = {};
		this.setPaths();
		this.data=this.parseUrl(this._scriptURL).data;
		this.addDependency(["chrono.css", "Module.js", "Horloge.js", "Chrono.js", "Alarme.js", "Minuteur.js"]);

//		for (let k in data) {
//			this.addDependency(k + ".js");
//		}
		this.evt = {

		};
		window.addEventListener("load", function () {
			App.load();
		});
	}
}
App.init();
