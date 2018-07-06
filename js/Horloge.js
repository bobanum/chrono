/*jslint browser:true, esnext:true*/
/*globals App, Module*/
class Horloge extends Module {
	constructor() {
		super();
		this.aiguilles = "images/aiguilles3.svg";
		this.enmarche = true;
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
	demarrer() {
		this.enMarche = true;
		this.tick();
		return this;
	}
	tick() {
		var that = this;
		this.ajuster();
		var delai = new Date().getMilliseconds();
		if (!this.enMarche) {
			return;
		}
		window.setTimeout(function () {
			that.tick();
		}, 1000-delai);
	}
	arreter() {
		this.enMarche = false;
		return this;
	}
	static load() {
		super.load();
		var h;
		h = new this.Analog();
		this.instances.push(h);
		this.dom.body.appendChild(h.dom);
		h.demarrer();
		h = new this.Digital();
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
Horloge.Analog = class extends Horloge {
	constructor() {
		super();
		this.aiguilles = "images/aiguilles3.svg";
	}
	dom_creer() {
		var resultat = this.createSvg("svg");
		resultat.setAttribute("viewBox", "0 0 100 100");
		var circle = this.createSvg("circle", resultat);
		circle.setAttribute("cx", "50");
		circle.setAttribute("cy", "50");
		circle.setAttribute("r", "50");
		circle.setAttribute("fill", "#abc");
		resultat.appendChild(this.dom_ombre());
		resultat.appendChild(this.dom_lignes());
		resultat.appendChild(this.dom_chiffres());
		resultat.appendChild(this.dom_aiguilles());
		this._dom = resultat;
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
	dom_ombre() {
		var resultat, filter, fe;
		resultat = this.createSvg("defs");
		filter = this.createSvg("filter", resultat);
		filter.setAttribute("color-interpolation-filters", "sRGB");
		filter.setAttribute("id", "ombre");
		fe = this.createSvg("feFlood", filter);
		fe.setAttribute("flood-color", "rgb(0,0,0)");
		fe.setAttribute("flood-opacity", ".3");
		fe.setAttribute("result", "flood");
		fe = this.createSvg("feComposite", filter);
		fe.setAttribute("in", "flood");
		fe.setAttribute("in2", "SourceGraphic");
		fe.setAttribute("operator", "in");
		fe.setAttribute("result", "composite1");
		fe = this.createSvg("feGaussianBlur", filter);
		fe.setAttribute("in", "composite1");
		fe.setAttribute("result", "blur");
		fe.setAttribute("stdDeviation", "0.25");
		fe = this.createSvg("feOffset", filter);
		fe.setAttribute("dx", "0.25");
		fe.setAttribute("dy", "0.25");
		fe.setAttribute("result", "offset");
		fe = this.createSvg("feComposite", filter);
		fe.setAttribute("in", "SourceGraphic");
		fe.setAttribute("in2", "offset");
		fe.setAttribute("result", "composite2");
		return resultat;
	}
	dom_aiguille(nom) {
		var resultat = this.createSvg("g");
		var use = this.createSvg("use", resultat);
		use.setAttribute("href", this.aiguilles + "#" + nom);
		use.setAttribute("class", nom);
		resultat.setAttribute("filter", "url(#ombre)");
		this[nom] = use;
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
};
Horloge.Digital = class extends Horloge {
	constructor() {
		super();
		this.chiffresDel = "images/chiffresdel.svg";
	}
	dom_creer() {
		var resultat;
		resultat = document.createElement("div");
		resultat.classList.add("digital");
		resultat.heures = resultat.appendChild(this.dom_del_nombre());
		resultat.appendChild(this.dom_del_points());
		resultat.minutes = resultat.appendChild(this.dom_del_nombre());
		resultat.appendChild(this.dom_del_points());
		resultat.secondes = resultat.appendChild(this.dom_del_nombre());
		this._dom = resultat;
		return resultat;
	}
	dom_del_points() {
		var resultat, circle;
		resultat = this.createSvg("svg");
		resultat.setAttribute("viewBox", "0 0 12 100");
//		resultat.setAttribute("width", "30");
//		resultat.setAttribute("height", "105");
		resultat.setAttribute("fill", "red");
		circle = resultat.appendChild(this.createSvg("circle", resultat));
		circle.setAttribute("r", 6);
		circle.setAttribute("cx", 6);
		circle.setAttribute("cy", 30);
		circle = resultat.appendChild(this.createSvg("circle", resultat));
		circle.setAttribute("r", 6);
		circle.setAttribute("cx", 6);
		circle.setAttribute("cy", 70);
		return resultat;
	}
	dom_del_nombre() {
		var resultat = document.createElement("div");
		resultat.dizaines = resultat.appendChild(this.dom_del());
		resultat.unites = resultat.appendChild(this.dom_del());
		return resultat;
	}
	dom_del() {
		var resultat = document.createElement("object");
		resultat.setAttribute("data", "images/chiffresdel.svg");
		return resultat;
	}
	ajuster() {
		var d = new Date();
		var s = d.getSeconds();
		var m = d.getMinutes();
		var h = d.getHours();
		this.appliquerNombre(h, this._dom.heures);
		this.appliquerNombre(m, this._dom.minutes);
		this.appliquerNombre(s, this._dom.secondes);
		return this;
	}
	appliquerNombre(nombre, groupe) {
		this.appliquerChiffre(Math.floor(nombre/10), groupe.dizaines);
		this.appliquerChiffre(Math.floor(nombre%10), groupe.unites);
		return this;
	}
	appliquerChiffre(nombre, chiffre) {
		chiffre = chiffre.contentDocument || chiffre;
		chiffre = chiffre.documentElement || chiffre;
		var traits = [
			"0111111",	//0
			"0011000",	//1
			"1110110",	//2
			"1111100",	//3
			"1011001",	//4
			"1101101",	//5
			"1101111",	//6
			"0111000",	//7
			"1111111",	//8
			"1111101"	//9
		];	//[63, 24, 118, 124, 89, 109, 111, 56, 127, 125]
		if (typeof nombre === "number") {
			nombre = traits[nombre];
		}
		var portions = Array.from(chiffre.children);
		portions.forEach(function (t, i) {
			t.style.fill = (nombre[i] === "1") ? "red": "transparent";
		});
	}
};
