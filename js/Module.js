/*jslint esnext:true, browser:true*/
/*globals App*/
/*exported Module*/
class Module {
	constructor() {
		this._dom = null;
	}
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
		this._dom = this.dom_module();
		this._dom.setAttribute("id", "module-" + this.name);
	}
	static dom_module() {
		var resultat = document.createElement("div");
		resultat.classList.add("module");
		resultat.header = resultat.appendChild(this.dom_header());
		resultat.footer = resultat.appendChild(this.dom_footer());
		resultat.body = resultat.appendChild(this.dom_body());
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
		var resultat = document.createElement("header");
		if (contenu) {
			resultat.appendChild(contenu);
		}
		resultat.appendChild(document.createTextNode("dom_header ("+this.name+")"));
		return resultat;
	}
	static dom_footer(contenu) {
		var resultat = document.createElement("footer");
		if (contenu) {
			resultat.appendChild(contenu);
		}
		resultat.appendChild(document.createTextNode("dom_footer ("+this.name+")"));
		return resultat;
	}
	static dom_body(contenu) {
		var resultat = document.createElement("div");
		resultat.classList.add("body");
		if (contenu) {
			resultat.appendChild(contenu);
		}
		resultat.appendChild(document.createTextNode("dom_body ("+this.name+")"));
		return resultat;
	}
	static load() {
		console.log(this.name);
		App.dom.appendChild(this.dom);
		this.dom.classList.add("body");
	}
	static init() {
		this.evt = {

		};
	}
}
Module.init();
