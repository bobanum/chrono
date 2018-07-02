/*jslint browser:true, esnext:true*/
/*globals App, Module*/
class Chrono extends Module {
	static creerCadran(secondes) {
		var temps, span;
		secondes = secondes || 0;
		temps = document.createElement("div");
		temps.setAttribute("id", "cadran");
		var s = secondes % 60;
		secondes = (secondes - s) / 60;
		var m = secondes % 60;
		secondes = (secondes - m) / 60;
		var h = secondes;
		span = temps.appendChild(this.temps("heures", h));
		span = temps.appendChild(this.separateur());
		span = temps.appendChild(this.temps("minutes", m));
		span = temps.appendChild(this.separateur());
		span = temps.appendChild(this.temps("secondes", s));
		return temps;
	}
	static temps(id, val) {
		var resultat, span;
		val = val || 0;
		resultat = document.createElement("span");
		resultat.setAttribute("id", id);
		resultat.classList.add("temps");
		span = resultat.appendChild(document.createElement("span"));
		span.classList.add("dizaines");
		span.innerHTML = Math.floor(val / 10);
		span = resultat.appendChild(document.createElement("span"));
		span.classList.add("unites");
		span.innerHTML = val % 10;
		return resultat;
	}
	static separateur(car) {
		car = car || "";
		var resultat;
		resultat = document.createElement("span");
		resultat.classList.add("separateur");
		if (car) {
			resultat.innerHTML = car;
		}
		return resultat;
	}
	static zzzcreerFormulaire() {
		var form, span, select;
		form = document.createElement("form");
		form.setAttribute("id", "duree");
		form.setAttribute("name", "duree");
		form.style.textAlign = "center";
		span = form.appendChild(document.createElement("span"));
		span.innerHTML = "Durée : ";
		select = form.appendChild(this.creerSelect("selectheures", 0, 5));
		select.classList.add("selectduree");
		select = form.appendChild(this.creerSelect("selectminutes", 0, 60, 3));
		select.classList.add("selectduree");
		select = form.appendChild(this.creerSelect("selectsecondes", 0, 60, 0));
		select.classList.add("selectduree");
		form.appendChild(this.dom_boutonPlay());
		form.appendChild(this.dom_boutonPause());
		form.appendChild(this.dom_boutonStop());
		form.appendChild(this.creerSelectSon(Chrono.sons, "tubularbell"));
		return form;
	}
	static zzzcreerSelect(nom, debut, fin, selected) {
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
	static zzzdom_boutonPlay() {
		var resultat;
		resultat = this.dom_bouton("btPlay", "A", this.evt.demarrer, {"accesskey": "D"});
		return resultat;
	}
	static zzzdom_boutonPause() {
		var resultat;
		resultat = this.dom_bouton("btPause", "D", this.evt.demarrer, {"disabled": "disabled", "accesskey": "P"});
		return resultat;
	}
	static zzzdom_boutonStop() {
		var resultat;
		resultat = this.dom_bouton("btPlay", "C", this.evt.demarrer, {"disabled": "disabled", "accesskey": "S"});
		return resultat;
	}
	static zzzcreerSelectSon(liste, defaut) {
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
	static demarrer() {
		var cadran = document.getElementById("cadran");
		var btDemarrer = document.getElementById('btDemarrer');
		var btPause = document.getElementById('btPause');
		var btStop = document.getElementById('btStop');
		var son = document.getElementById('son');
		var sec = this.prendreDuree();
		if (sec) {
			btPause.setAttribute('disabled', 'disabled');
			btPause.removeAttribute('disabled');
			btStop.removeAttribute('disabled');
			this.ajusterTemps(cadran, sec);
			cadran.interval = window.setInterval(this.intTemps, 100);
			son.setAttribute("src", "");
			document.querySelectorAll("#duree .selectduree").forEach(function (e) {
				e.setAttribute("disabled", "disabled");
			});
		}
	}
	static arreter() {
		var cadran = document.getElementById("cadran");
		var btDemarrer = document.getElementById('btDemarrer');
		var btPause = document.getElementById('btPause');
		var btStop = document.getElementById('btStop');
		var son = document.getElementById('son');
		btDemarrer.value = "Démarrer";
		window.clearInterval(cadran.interval);
		cadran.duree = 0;
		this.appliquerTemps(cadran);
		son.setAttribute("src", "");
		btPause.value = "Pause";
		btPause.setAttribute("disabled", "disabled");
		btStop.setAttribute("disabled", "disabled");
		document.querySelectorAll("#duree .selectduree").forEach(function (e) {
			e.removeAttribute("disabled");
		});
	}
	static creerSon() {
		/*var obj = document.createElement("object");
		obj.classid = "CLSID:05589FA1-C356-11CE-BF01-00AA0055595A";
		obj.height = "0";
		obj.id="son";
		obj.width="0";
		var param = obj.appendChild(document.createElement("param"));
		param.name = "Appearance";
		param.value = "0";
		var param = obj.appendChild(document.createElement("param"));
		param.name = "AutoStart";
		param.value = "1";
		var param = obj.appendChild(document.createElement("param"));
		param.name = "Filename";
		param.value = "heyhey.mid";
		var param = obj.appendChild(document.createElement("param"));
		param.name = "Volume";
		param.value = "7";
		return obj;*/
		var obj = document.createElement("embed");
		obj.setAttribute("id", "son");
		obj.setAttribute("type", "audio/midi");
		obj.setAttribute("width", 0);
		obj.setAttribute("height", 0);
		obj.setAttribute("src", "");
		obj.setAttribute("controller", false);
		obj.setAttribute("hidden", true);
		obj.setAttribute("autoplay", true);
		obj.setAttribute("volume", 100);
		return obj;
	}
	static intTemps() {
		var cadran = document.getElementById("cadran");
		var son = document.getElementById("son");
		var choixson = document.getElementById("choixson").value;
		this.ajusterTemps(cadran);
		if (cadran.duree <= 0) {
			cadran.duree = 0;
			this.ajusterTemps(cadran);
			son.setAttribute("src", "sons/" + choixson.val + ".mid");
			window.clearInterval(cadran.interval);
		}
	}
	static ajusterTemps(cadran, duree) {
		if (duree !== undefined) {
			cadran.duree = duree;
			cadran.debut = new Date() * 1;
			cadran.fin = cadran.duree + cadran.debut;
		} else if (cadran.duree > 0) {
			cadran.duree = cadran.fin - (new Date() * 1);
		} else {
			cadran.duree = 0;
		}
		duree = Math.floor(cadran.duree / 1000);
		this.appliquerTemps(cadran, duree);
	}
	static appliquerTemps(cadran, temps) {
		if (isNaN(temps)) {
			temps = this.prendreDuree() / 1000;
		}
		debugger;
		console.log(cadran, temps);
		cadran.parentNode.replaceChild(this.creerCadran(temps), cadran);
//		var h = Math.floor(temps / 3600);
//		h = "00" + h;
//		h = h.substr(h.length - 2);
//		document.getElementById('heures').innerHTML = h;
//
//		temps %= 3600;
//		var m = Math.floor(temps / 60);
//		m = "00" + m;
//		m = m.substr(m.length - 2);
//		document.getElementById('minutes').innerHTML = m;
//
//		temps %= 60;
//		var s = temps;
//		s = "00" + s;
//		s = s.substr(s.length - 2);
//		document.getElementById('secondes').innerHTML = s;
	}
	static prendreDuree() {
		var sec = document.getElementById("selectheures").value * 3600;
		sec += document.getElementById("selectminutes").value * 60;
		sec += document.getElementById("selectsecondes").value * 1;
		return sec * 1000;
	}
	static init() {
		var self = this;
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
			App.header.appendChild(self.creerFormulaire());
			App.header.appendChild(self.creerSon());
			App.body.appendChild(self.creerCadran());
			self.appliquerTemps(document.getElementById("cadran"));
		});
	}
}
Chrono.init();
