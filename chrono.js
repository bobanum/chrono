/*jslint browser:true, esnext:true*/
/*exported Chrono*/
/*globals*/
class Chrono {
    static dom_chrono() {
		var resultat = document.createElement("div");
		resultat.classList.add("chrono");
        resultat.appendChild(this.dom_formulaire());
		resultat.appendChild(this.dom_temps());
        return resultat;
	}
    static dom_temps() {
        var resultat, span;
		resultat = document.createElement("div");
        resultat.setAttribute("id", "temps");
		span = resultat.appendChild(document.createElement("span"));
        span.setAttribute("id", "heures");
        span.classList.add("temps");
        span.innerHTML = "00";
        span = resultat.appendChild(document.createElement("span"));
		span.innerHTML = ":";
        span = resultat.appendChild(document.createElement("span"));
		span.setAttribute("id", "minutes");
		span.classList.add("temps");
		span.innerHTML = "00";
        span = resultat.appendChild(document.createElement("span"));
		span.innerHTML = ":";
        span = resultat.appendChild(document.createElement("span"));
		span.setAttribute("id", "secondes");
		span.classList.add("temps");
		span.innerHTML = "00";
        resultat.ajuster = this.ajusterTemps;
		this.temps = resultat;
		resultat.obj = this;
        return resultat;
    }

    static dom_separateur() {
        var resultat;
        resultat = document.createElement("span");
		resultat.classList.add("separateur");
		resultat.innerHTML = ":";
        return resultat;
    }

    static dom_formulaire() {
        var resultat;
		resultat = document.createElement("form");
		resultat.setAttribute("id", "duree");
		resultat.setAttribute("name", "duree");
		resultat.appendChild(this.dom_duree());
		resultat.appendChild(this.dom_boutons());
		this.form = resultat;
		resultat.obj = this;
        return resultat;
    }

    static dom_boutons() {
        var resultat;
		resultat = document.createElement("fieldset");
		resultat.classList.add("boutons");
		resultat.appendChild(this.dom_btDemarrer());
		resultat.appendChild(this.dom_btArreter());
		resultat.appendChild(this.dom_btPause());
		resultat.appendChild(this.dom_btRedemarrer());
        return resultat;
    }

    static dom_duree() {
        var resultat, span;
		resultat = document.createElement("fieldset");
		resultat.classList.add("duree");
		span = resultat.appendChild(document.createElement("span"));
		span.textContent = "Durée : ";
		resultat.appendChild(this.creerSelect("selectheures", 0, 5));
		resultat.appendChild(this.dom_separateur());
		resultat.appendChild(this.creerSelect("selectminutes", 0, 60, 3));
		resultat.appendChild(this.dom_separateur());
		resultat.appendChild(this.creerSelect("selectsecondes", 0, 60, 0));
		this.duree = resultat;
		resultat.obj = this;
        return resultat;
    }

    static creerSelect(nom, debut, fin, value) {
        var resultat;
		value = value || 0;
        fin = fin || 60;
        debut = debut || 0;
        resultat = document.createElement("select");
		resultat.setAttribute("id", nom);
		resultat.setAttribute("name", nom);
        for (let i = debut; i <= fin; i += 1) {
            let option = resultat.appendChild(document.createElement("option"));
			option.setAttribute("value", i);
			option.textContent = (("00" + i).substr(("00" + i).length - 2));
        }
        resultat.value = value;
		resultat.addEventListener("change", ()=>this.appliquerTemps());
        return resultat;
    }

    static dom_btDemarrer() {
        var resultat;
		resultat = document.createElement("input");
		resultat.setAttribute("id", "btDemarrer");
		resultat.setAttribute("type", "button");
		resultat.setAttribute("value", "Démarrer");
		resultat.setAttribute("accesskey", "D");
		resultat.addEventListener("click", this.evt.btDemarrer.click);
		this.btDemarrer = resultat;
		resultat.obj = this;
		return resultat;
    }
    static dom_btArreter() {
        var resultat;
		resultat = document.createElement("input");
		resultat.setAttribute("id", "btArreter");
		resultat.setAttribute("type", "button");
		resultat.setAttribute("value", "Arrêter");
		resultat.setAttribute("accesskey", "A");
		resultat.setAttribute("disabled", "disabled");
		resultat.addEventListener("click", this.evt.btArreter.click);
		this.btArreter = resultat;
		resultat.obj = this;
		return resultat;
    }

    static dom_btPause() {
        var resultat;
        resultat = document.createElement("input");
		resultat.setAttribute("id", "btPause");
		resultat.setAttribute("type", "button");
		resultat.setAttribute("value", "Pause");
		resultat.setAttribute("disabled", "disabled");
		resultat.setAttribute("accesskey", "P");
		resultat.addEventListener("click", this.evt.btPause.click);
		this.btPause = resultat;
		resultat.obj = this;
		return resultat;
    }
    static dom_btRedemarrer() {
        var resultat;
        resultat = document.createElement("input");
		resultat.setAttribute("id", "btRedemarrer");
		resultat.setAttribute("type", "button");
		resultat.setAttribute("value", "Redémarrer");
		resultat.setAttribute("disabled", "disabled");
		resultat.setAttribute("accesskey", "R");
		resultat.addEventListener("click", this.evt.btRedemarrer.click);
		this.btRedemarrer = resultat;
		resultat.obj = this;
		return resultat;
    }

    static intTemps() {
        var temps = this.temps;
        temps.ajuster();
        if (temps.duree <= 0) {
            temps.duree = 0;
            temps.ajuster();
            window.clearInterval(temps.interval);
        }
		return temps;
    }
	static demarrer() {
		var temps = this.temps;
		var sec = Chrono.prendreDuree();
		if (sec) {
			temps.ajuster(sec);
			temps.interval = window.setInterval(this.intTemps, 100);
			this.btDemarrer.setAttribute("disabled", "disabled");
			this.btPause.removeAttribute("disabled");
			this.btArreter.removeAttribute("disabled");
			this.duree.setAttribute("disabled", "disabled");
		}
		return this;
	}
	static arreter() {
		var temps = this.temps;
		window.clearInterval(temps.interval);
		temps.duree = 0;
		this.appliquerTemps();
		this.btArreter.setAttribute("disabled", "disabled");
		this.btPause.setAttribute("disabled", "disabled");
		this.btRedemarrer.setAttribute("disabled", "disabled");
		this.btDemarrer.removeAttribute("disabled");
		this.duree.removeAttribute("disabled");
	}
	static pause() {
		var temps = this.temps;
		this.btPause.setAttribute("disabled", "disabled");
		this.btRedemarrer.removeAttribute("disabled");
		window.clearInterval(temps.interval);
	}
	static redemarrer() {
		var temps = this.temps;
		this.btPause.removeAttribute("disabled");
		this.btRedemarrer.setAttribute("disabled", "disabled");
		temps.ajuster(temps.duree);
		temps.interval = window.setInterval(this.intTemps, 400);
	}
    static ajusterTemps(duree) {
		if (duree !== undefined) {
            this.duree = duree;
            this.debut = new Date() * 1;
            this.fin = this.duree + this.debut;
        } else if (this.duree > 0) {
            this.duree = this.fin - (new Date() * 1);
        } else {
            this.duree = 0;
        }
        duree = Math.floor(this.duree / 1000);
        Chrono.appliquerTemps(duree);
    }

    static appliquerTemps(temps) {
        if (isNaN(temps)) {
			temps = this.prendreDuree() / 1000;
        }
		var t;
        t = this.formatInt(temps, 3600);
        document.getElementById('heures').textContent = t;

        t = this.formatInt(temps, 60, 60);
        document.getElementById('minutes').textContent = t;

        t = this.formatInt(temps, 1, 60);
        document.getElementById('secondes').textContent = t;
    }

	static formatInt(int, div, mod) {
		var resultat;
		div = div || 1;
		resultat = Math.floor(int / div);
		if (mod) {
			resultat = resultat % mod;
		}
        resultat = "00" + resultat;
        resultat = resultat.slice(-2);
		return resultat;
	}

    static prendreDuree() {
        var sec = document.getElementById("selectheures").value * 3600;
        sec += document.getElementById("selectminutes").value * 60;
        sec += document.getElementById("selectsecondes").value * 1;
        return sec * 1000;
    }
    static load() {
        document.body.appendChild(this.dom_chrono());
        this.appliquerTemps();
    }

    static init() {
		this.evt = {
            btDemarrer: {
                click: function() {
					this.obj.demarrer();
                }
            },
            btArreter: {
                click: function() {
					this.obj.arreter();
                }
            },
            btPause: {
                click: function() {
					this.obj.pause();
                }
            },
            btRedemarrer: {
                click: function() {
					this.obj.redemarrer();
                }
            }
        };
        window.addEventListener("load", function () {
            Chrono.load();
        });
    }
}
Chrono.init();
