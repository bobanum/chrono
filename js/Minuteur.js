/*jslint browser:true, esnext:true*/
/*globals Horloge, Module, App*/
class Minuteur extends Module {
	constructor() {
		this.debut = null;
		this.duree = 60*3;
	}
	dom_creer() {
		var resultat = super.dom_creer();
		this.header.appendChild(this.dom_formulaire());
		return resultat;
	}
	dom_formulaire() {
		var form, span, select;
		form = document.createElement("form");
		form.setAttribute("id", "duree");
		form.setAttribute("name", "duree");
		form.style.textAlign = "center";
		span = form.appendChild(document.createElement("span"));
		span.innerHTML = "Durée : ";
		select = form.appendChild(this.dom_selectNombre("selectheures", 0, 5));
		select.classList.add("selectduree");
		select = form.appendChild(this.dom_selectNombre("selectminutes", 0, 60, 3));
		select.classList.add("selectduree");
		select = form.appendChild(this.dom_selectNombre("selectsecondes", 0, 60, 0));
		select.classList.add("selectduree");
		form.appendChild(this.dom_boutonPlay());
		form.appendChild(this.dom_boutonPause());
		form.appendChild(this.dom_boutonStop());
		form.appendChild(this.dom_selectSon(Horloge.sons, "tubularbell"));
		return form;
	}
	dom_selectNombre(nom, debut, fin, selected) {
		selected = selected || 0;
		fin = fin || 60;
		debut = debut || 0;
		var temp = fin;
		var pad = "";
		while (temp > 0) {
			pad += "0";
			temp = Math.floor(temp / 10);
		}
		var values = {};
		for (let i = debut; i <= fin; i += 1) {
			values[i] = (pad + i).slice(-pad.length);
		}
		var resultat = this.dom_select(nom, values, selected);
		return resultat;
	}
	dom_boutonPlay() {
		var resultat;
		resultat = this.dom_bouton("btPlay", "A", this.evt.btPlay, {"accesskey": "D"});
		return resultat;
	}
	dom_boutonPause() {
		var resultat;
		resultat = this.dom_bouton("btPause", "B", this.evt.btPause, {"disabled": "disabled", "accesskey": "P"});
		return resultat;
	}
	dom_boutonStop() {
		var resultat;
		resultat = this.dom_bouton("btStop", "C", this.evt.btStop, {"disabled": "disabled", "accesskey": "S"});
		return resultat;
	}
	dom_selectSon(liste, defaut) {
		var resultat;
		defaut = defaut || "";
		resultat = document.createElement("select");
		resultat.setAttribute("id", "choixson");
		resultat.setAttribute("name", "choixson");
		for (let i = 0, n = liste.length; i < n; i += 1) {
			let nomson = liste[i].replace(" ", "").toLowerCase();
			let option = resultat.appendChild(document.createElement("option"));
			option.setAttribute("value", nomson);
			option.innerHTML = liste[i];
		}
		resultat.value = defaut;
		return resultat;
	}
	static init() {
		var self = this;
		App.modules.push(this);
		this.icone = "b";
		this.label = this.name;

		this.prototype.evt = {
			select: {
				change: function () {
					self.appliquerTemps(document.getElementById("cadran"), self.prendreDuree() / 1000);
				}
			},
			btPlay: {
				click: function () {
					self.demarrer();
				}
			},
			btPause: {
				click: function () {
					var cadran = document.getElementById("cadran");
					if (this.value === "B") {
						this.value = "D";
						window.clearInterval(cadran.interval);
					} else {
						this.value = "B";
						cadran.ajusterTemps(cadran, cadran.duree);
						cadran.interval = window.setInterval(self.intTemps, 400);
					}
				}
			},
			btStop: {
				click: function () {
					self.arreter();
				}
			}
		};
		window.addEventListener("load", function () {
			Minuteur.load();
		});
	}
}
Minuteur.init();
