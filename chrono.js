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
		span = resultat.appendChild(this.dom_nombre("heures"));
        span = resultat.appendChild(this.dom_separateur());
		span = resultat.appendChild(this.dom_nombre("minutes"));
        span = resultat.appendChild(this.dom_separateur());
		span = resultat.appendChild(this.dom_nombre("secondes"));
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
	static dom_nombre(id, n) {
		var resultat, span;
		n = n || 0;
		resultat = document.createElement("span");
		resultat.classList.add("temps");
		if (id) {
			resultat.setAttribute("id", id);
		}
		span = resultat.appendChild(document.createElement("span"));
		span.classList.add("dizaines");
		span.innerHTML = Math.floor(n / 10);
		span = resultat.appendChild(document.createElement("span"));
		span.classList.add("unites");
		span.innerHTML = n % 10;
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
		this.form_duree = resultat;
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
    static dom_bt(id, label, click, accesskey) {
        var resultat;
		if (!click) {
			click = this.evt[id].click;
		}
		resultat = document.createElement("input");
		resultat.setAttribute("id", id);
		resultat.setAttribute("type", "button");
		resultat.setAttribute("value", label);
		if (accesskey) {
			resultat.setAttribute("accesskey", accesskey);
		}
		resultat.addEventListener("click", click);
		this[id] = resultat;
		resultat.obj = this;
		return resultat;
    }
    static dom_btDemarrer() {
        var resultat;
		resultat = this.dom_bt("btDemarrer", "Démarrer", null, "D");
		return resultat;
    }
    static dom_btArreter() {
        var resultat;
		resultat = this.dom_bt("btArreter", "Arrêter", null, "A");
		return resultat;
    }
    static dom_btPause() {
        var resultat;
		resultat = this.dom_bt("btPause", "Pause", null, "P");
		resultat.setAttribute("disabled", "disabled");
		return resultat;
    }
    static dom_btRedemarrer() {
        var resultat;
		resultat = this.dom_bt("btRedemarrer", "Redémarrer", null, "R");
		resultat.setAttribute("disabled", "disabled");
		return resultat;
    }
    static intervalTemps() {
		var now = new Date().getTime();
		var tick = this.fin - now;
		var sec = Math.round(tick / 1000);
        if (sec > 0) {
			this.ajusterTemps(tick);
			this.interval = window.setTimeout(()=>this.intervalTemps(), this.prochainTick(now));
        }
		return this;
    }
    static prochainTick(now, redemarrer) {
		var tick = this.fin - now;
		var sec = tick / 1000;
		if (redemarrer) {
			sec = Math.ceil(sec);
		} else {
			sec = Math.round(sec);
		}
		var then = this.fin - (sec-1) * 1000;
		return then - now;
    }
	static demarrer() {
		var duree = this.prendreDuree();
		if (duree) {
			this.debut = new Date().getTime();
			this.duree = duree;
			this.fin = this.debut + duree;
//			this.ajusterTemps(duree);
//			this.appliquerTemps();
			this.interval = window.setTimeout(()=>this.intervalTemps(), 1000);
			this.btDemarrer.setAttribute("disabled", "disabled");
			this.btPause.removeAttribute("disabled");
			this.btArreter.removeAttribute("disabled");
			this.form_duree.setAttribute("disabled", "disabled");
		}
		return this;
	}
	static arreter() {
		window.clearTimeout(this.interval);
		this.duree = 0;
		this.appliquerTemps();
		this.btArreter.setAttribute("disabled", "disabled");
		this.btPause.setAttribute("disabled", "disabled");
		this.btRedemarrer.setAttribute("disabled", "disabled");
		this.btDemarrer.removeAttribute("disabled");
		this.form_duree.removeAttribute("disabled");
	}
	static pause() {
		this.duree = this.fin - new Date().getTime();
		this.btPause.setAttribute("disabled", "disabled");
		this.btRedemarrer.removeAttribute("disabled");
		window.clearTimeout(this.interval);
	}
	static redemarrer() {
		this.btPause.removeAttribute("disabled");
		this.btRedemarrer.setAttribute("disabled", "disabled");
		this.ajusterTemps(this.duree);
		this.interval = window.setTimeout(()=>this.intervalTemps(), this.prochainTick(new Date().getTime(), true));
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
        duree = Math.round(this.duree / 1000);
        this.appliquerTemps(duree);
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
