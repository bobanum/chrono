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
	static dom_menuItem() {
		var resultat, img;
		resultat = document.createElement("li");
		resultat.setAttribute("title", this.label);
		var input = resultat.appendChild(document.createElement("input"));
		input.setAttribute("type", "radio");
		input.setAttribute("name", "radioModule");
		input.setAttribute("id", "radioModule-" + this.name);
		input.setAttribute("value", this.name);
		input.obj = this;
		img = resultat.appendChild(document.createElement("label"));
		img.setAttribute("for", "radioModule-" + this.name);
		img.appendChild(document.createTextNode(this.icone));
//		App.bind(resultat, this.evt.menu);
		input.addEventListener("change", function () {
			if (this.form.actif) {
				this.form.actif.obj.dom.classList.remove("actif");
			}
			this.form.actif = this;
			this.obj.dom.classList.toggle("actif", this.checked);
		});
		return resultat;
//		return App.dom_menuItem(this.icone, this.evt.menuAlarm);
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
		App.dom.appendChild(this.dom);
		this.dom.classList.add("body");
	}
	static init() {
		this.icone = "a";
		this.evt = {

		};
	}
}
Module.init();
