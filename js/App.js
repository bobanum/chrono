/*jslint esnext:true, browser:true*/
/*exported App*/
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
	static init() {
//		var self = this;
		this.dependencies = {};
		this.setPaths();
		var data=this.parseUrl(this._scriptURL).data;
		this.addDependency("Module.js");
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
