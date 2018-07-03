/*jslint browser:true, esnext:true*/
/*globals App, Module*/
class Alarme extends Module {
	static dom_menuItem() {
		return App.dom_menuItem("a", this.evt.menuAlarm);
	}
	static load() {
		super.load();
//		App.header.appendChild(this.creerFormulaire());
//		App.header.appendChild(this.creerSon());
//		App.body.appendChild(this.creerCadran());
//		this.appliquerTemps(document.getElementById("cadran"));
	}
	static init() {
		var self = this;
		App.modules.push(this);

		this.evt = {
			select: {
				change: function () {
					self.appliquerTemps(document.getElementById("cadran"), self.prendreDuree() / 1000);
				}
			},
			demarrer: {
				click: function () {
					self.demarrer();
				}
			},
			pause: {
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
			stop: {
				click: function () {
					self.arreter();
				}
			}
		};
		window.addEventListener("load", function () {
			Alarme.load();
		});
	}
}
Alarme.init();
