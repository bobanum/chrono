/*jslint browser:true, esnext:true*/
/*globals App, Module, Minuteur*/
class Horloge extends Module {
	constructor() {
		super();
		this.debut = null;
	}
	dom_creer() {
		var resultat = super.dom_creer();
		resultat.classList.add("interface");
		return resultat;
	}
	static dom_menu() {
		var resultat;
		resultat = document.createElement("ul");
		resultat.classList.add("icones");
		resultat.appendChild(this.dom_menuItem("a", this.evt.menuAlarm));
		resultat.appendChild(this.dom_menuItem("b", this.evt.menuMinuteur));
		resultat.appendChild(this.dom_menuItem("c", this.evt.menuChrono));
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
	static init() {
		var self = this;
		App.addDependency("Minuteur.js");
		App.addDependency("Chrono.css");
		this.sons = [
			"Heyhey",
			"Tubular Bell",
			"Sabre Dance",
			"Holiday",
			"Borderline",
			"Lucky Star",
			"Tarkus",
			"James Bond"
		];
		this.evt = {
			menuAlarm: {
				click: function () {
//					alert(1);
				}
			},
			menuMinuteur: {
				click: function () {
					var minuteur = new Minuteur();
					window.horloge.body.appendChild(minuteur.dom);
				}
			},
			menuChrono: {
				click: function () {
//					alert(3);
				}
			}
		};
		window.addEventListener("load", function () {
			window.horloge = new self();
			document.body.appendChild(window.horloge.dom);
			window.horloge.header.appendChild(self.dom_menu());
		});
	}
}
Horloge.init();
