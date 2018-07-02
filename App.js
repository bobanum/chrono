/*jslint esnext:true, browser:true*/
/*exported App, Module*/
class Module {
	constructor() {
		this._dom = null;
	}
	get dom() {
		if (!this._dom) {
			this._dom = this.dom_creer();
		}
		return this._dom;
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
	dom_interface() {
		var resultat;
		resultat = document.createElement("div");
		resultat.classList.add("interface");
		return resultat;
	}
	dom_bouton(id, value, evts, attributes) {
		var resultat;

		resultat = document.createElement("span");
		resultat.setAttribute("id", id);
		resultat.setAttribute("class", "button");
		resultat.innerHTML = value;
		Module.bind(resultat, evts);
		Module.setAttributes(resultat, attributes);
		return resultat;
	}
	dom_creer() {
		var resultat;
		resultat = document.createElement("section");
		resultat.classList.add("module");
		resultat.appendChild(this.dom_header());
		resultat.appendChild(this.dom_footer());
		resultat.appendChild(this.dom_body());
		resultat.obj = this;
		return resultat;
	}
	dom_header(contenu) {
		this.header = document.createElement("header");
		if (contenu) {
			this.header.appendChild(contenu);
		}
		this.header.innerHTML = "dom_header";
		return this.header;
	}
	dom_footer(contenu) {
		this.footer = document.createElement("footer");
		if (contenu) {
			this.header.appendChild(contenu);
		}
		this.footer.innerHTML = "dom_footer";
		return this.footer;
	}
	dom_body(contenu) {
		this.body = document.createElement("div");
		this.body.classList.add("body");
		if (contenu) {
			this.header.appendChild(contenu);
		}
		this.body.innerHTML = "dom_body";
		return this.body;
	}
	dom_select(id, values, evts, selected, attributes) {
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
		Module.bind(resultat, evts);
		Module.setAttributes(resultat, attributes);
		return resultat;
	}
	dom_option(value, label, selected) {
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
	static init() {
		this.evt = {

		};
	}
}
Module.init();

class App {
	constructor() {
	}
	static addDependency(url, attributes) {
		var element, id;
		id = url.replace(/[^a-zA-Z0-9\_\-\.]/g, "_");
		if (this.dependencies[id] !== undefined) {
			return this.dependencies[id];
		}
		if (url.slice(-3) === ".js") {
			element = document.createElement("script");
			element.setAttribute("src", this.scriptPath + "/" + url);
		} else if (url.slice(-4) === ".css") {
			element = document.createElement("link");
			element.setAttribute("href", this.scriptPath + "/" + url);
			element.setAttribute("rel", "stylesheet");
		}
		element.setAttribute("id", id);
		Module.setAttributes(element, attributes);
		this.dependencies[id] = element;
		document.head.appendChild(element);
		return this.dependencies[id];
	}
	static setScriptPath() {
		this.scriptURL = document.head.lastChild.getAttribute('src');
		this.scriptPath = document.head.lastChild.getAttribute('src').split('/').slice(0,-1);
		if (this.scriptPath.length === 0) {
			this.scriptPath = ".";
		} else {
			this.scriptPath = this.scriptPath.join("/");
		}
		return this;
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
	static init() {
//		var self = this;
		this.dependencies = {};
		this.setScriptPath();
		var data=this.parseUrl(this.scriptURL).data;
		for (let k in data) {
			this.addDependency(k + ".js");
		}
		this.evt = {

		};
		window.addEventListener("load", function () {
		});
	}
}
App.init();
