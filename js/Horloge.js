/*jslint browser:true, esnext:true*/
/*globals App, Module*/
class Horloge extends Module {
	constructor() {
		super();
		this.aiguilles = "images/aiguilles.svg";
	}
	dom_creer() {
		var resultat = this.createSvg("svg");
		resultat.setAttribute("viewBox", "0 0 100 100");
		var circle = this.createSvg("circle", resultat);
		circle.setAttribute("cx", "50");
		circle.setAttribute("cy", "50");
		circle.setAttribute("r", "50");
		resultat.appendChild(this.dom_lignes());
		resultat.appendChild(this.dom_chiffres());
		resultat.appendChild(this.dom_aiguilles());
		this._dom = resultat;
		return resultat;
	}
	static focus() {
		super.focus();
		this.instances.forEach(i => i.demarrer());
		return this;
	}
	static blur() {
		super.blur();
		this.instances.forEach(i => i.arreter());
		return this;

	}
	createSvg(tag, container) {
		var resultat = document.createElementNS("http://www.w3.org/2000/svg", tag);
		if (container) {
			container.appendChild(resultat);
		}
		return resultat;
	}
	dom_chiffres() {
		var resultat = this.createSvg("g");
		resultat.setAttribute("x", "50");
		resultat.setAttribute("y", "50");
		resultat.setAttribute("transform", "translate(50 50)");
		for (let i = 1; i <= 12; i += 1) {
			let ch = this.createSvg("text", resultat);
			ch.appendChild(document.createTextNode(i));
			ch.setAttribute("text-anchor", "middle");
			ch.setAttribute("alignment-baseline", "middle");
			ch.setAttribute("letter-spacing", "-.1em");
			let angle = (i)*360/12;
			ch.setAttribute("transform", "rotate("+angle+") translate(0 -43) rotate("+-angle+")");
		}
		return resultat;
	}
	dom_aiguilles() {
		var resultat = this.createSvg("g");
		resultat.setAttribute("transform", "translate(50 50)");
		resultat.appendChild(this.dom_aiguille("heures"));
		resultat.appendChild(this.dom_aiguille("minutes"));
		resultat.appendChild(this.dom_aiguille("secondes"));
		return resultat;
	}
	dom_aiguille(nom) {
		var resultat = this.createSvg("use");
		resultat.setAttribute("href", this.aiguilles + "#" + nom);
		resultat.setAttribute("class", nom);
		this[nom] = resultat;
		return resultat;
	}
	dom_lignes() {
		var resultat = this.createSvg("g");
		resultat.setAttribute("class", "lignes");

		resultat.setAttribute("transform", "translate(50 50)");
		for (let i = 0; i < 60; i += 1) {
			if (i%5 === 0) {
				continue;
			}
			var ligne = this.createSvg("path", resultat);
			ligne.setAttribute("d", "m0 -43 0 -1");
			ligne.setAttribute("transform", "rotate(" + (i*6) + ")");
		}
		return resultat;
	}
	demarrer() {
		var that = this;
		this.interval = window.setInterval(function () {
			that.ajuster();
		}, 990);
		this.ajuster();
		return this;
	}
	arreter() {
		window.clearInterval(this.interval);
		return this;
	}
	ajuster() {
		var d = new Date();
		var s = (360 / 60) * d.getSeconds();
		var m = (360 / 60) * d.getMinutes();
		var h = (360 / 12) * (d.getHours() + d.getMinutes() / 60);
		this.heures.setAttribute("transform", "rotate(" + h + ")");
		this.minutes.setAttribute("transform", "rotate(" + m + ")");
		this.secondes.setAttribute("transform", "rotate(" + s + ")");
		return this;
	}
	static load() {
		super.load();
		var h = new this();
		this.instances.push(h);
		this.dom.body.appendChild(h.dom);
		h.demarrer();
	}
	static init() {
		App.modules.push(this);
		this.icone = "d";
		this.label = this.name;
		this.instances = [];
		window.addEventListener("load", function () {
			Horloge.load();
		});
	}
}
Horloge.init();
