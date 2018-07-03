/*jslint browser:true, esnext:true*/
/*globals App, Module, Minuteur*/
class Horloge extends Module {
	static dom_header(contenu) {
		var resultat = document.createElement("header");
		if (contenu) {
			resultat.appendChild(contenu);
		}
		resultat.appendChild(document.createTextNode("dom_header (Horloge)"));
		return resultat;
	}
	static load() {
		super.load();
//		App.body.appendChild(this.dom);
//		App.horloge = new this();
//		window.horloge.header.appendChild(this.dom_menu());
	}
	static init() {
		App.modules.push(this);
		this.icone = "d";
		this.label = this.name;
		this.evt = {
			menu: {
				click: function () {
					;
				}
			}
		};
		window.addEventListener("load", function () {
			Horloge.load();
		});
	}
}
Horloge.init();
