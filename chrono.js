/*jslint browser:true, esnext:true*/
/*exported Chrono*/
/*globals*/
class Chrono {
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

    static dom_formulaire() {
        var resultat;
		resultat = document.createElement("form");
		resultat.setAttribute("id", "duree");
		resultat.setAttribute("name", "duree");
		resultat.appendChild(this.dom_duree());
		resultat.appendChild(this.dom_boutons());
		resultat.appendChild(this.dom_selectSon());
		this.form = resultat;
		resultat.obj = this;
        return resultat;
    }

    static dom_boutons() {
        var resultat;
		resultat = document.createElement("fieldset");
		resultat.appendChild(this.dom_btDemarrer());
		resultat.appendChild(this.dom_btArreter());
		resultat.appendChild(this.dom_btPause());
		resultat.appendChild(this.dom_btRedemarrer());
        return resultat;
    }

    static dom_duree() {
        var resultat, span;
		resultat = document.createElement("fieldset");
		span = resultat.appendChild(document.createElement("span"));
		span.textContent = "Durée : ";
		resultat.appendChild(this.creerSelect("selectheures", 0, 5));
		resultat.appendChild(this.creerSelect("selectminutes", 0, 60, 3));
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
		resultat.addEventListener("change", this.appliquerTemps);
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

    static dom_selectSon() {
        var resultat, select;
        resultat = document.createElement("fieldset");
		select = resultat.appendChild(document.createElement("select"));
		select.setAttribute("id", "choixson");
		select.setAttribute("name", "choixson");
        for (let i = 0, n = this.sons.length; i < n; i += 1) {
			let nomson = this.sons[i].replace(" ", "").toLowerCase();
			let option = select.appendChild(document.createElement("option"));
			option.setAttribute("value", nomson);
			option.textContent = this.sons[i];
        }
        select.value = this.sonDefaut;
        return resultat;
    }

    static dom_son() {
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
		var resultat;
        resultat = document.createElement("embed");
		resultat.setAttribute("id", "son");
		resultat.setAttribute("type", "audio/midi");
		resultat.setAttribute("width", 0);
		resultat.setAttribute("height", 0);
		resultat.setAttribute("src", "");
		resultat.setAttribute("controller", false);
		resultat.setAttribute("hidden", true);
		resultat.setAttribute("autoplay", true);
		resultat.setAttribute("volume", 100);
        return resultat;
    }

    static intTemps() {
        var temps = document.getElementById("temps");
        temps.ajuster();
        if (temps.duree <= 0) {
            temps.duree = 0;
            temps.ajuster();
			let choixson = document.getElementById("choixson").value;
			let src = "sons/" + choixson + ".mid";
            document.getElementById("son").setAttribute("src", src);
            window.clearInterval(temps.interval);
        }
		return temps;
    }

    static ajusterTemps(duree) {
        console.log(this);
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
        var h = Math.floor(temps / 3600);
        h = "00" + h;
        h = h.substr(h.length - 2);
        document.getElementById('heures').textContent = h;

        temps %= 3600;
        var m = Math.floor(temps / 60);
        m = "00" + m;
        m = m.substr(m.length - 2);
        document.getElementById('minutes').textContent = m;

        temps %= 60;
        var s = temps;
        s = "00" + s;
        s = s.substr(s.length - 2);
        document.getElementById('secondes').textContent = s;
    }

    static prendreDuree() {
        var sec = document.getElementById("selectheures").value * 3600;
        sec += document.getElementById("selectminutes").value * 60;
        sec += document.getElementById("selectsecondes").value * 1;
        return sec * 1000;
    }
    static load() {
        document.body.appendChild(this.dom_formulaire());
		document.body.appendChild(this.dom_temps());
		document.body.appendChild(this.dom_son());
        this.appliquerTemps();
    }

    static init() {
		this.sons = ["Heyhey", "Tubular Bell", "Sabre Dance", "Holiday", "Borderline", "Lucky Star", "Tarkus", "James Bond"];
		this.sons.sort();
		this.sonDefaut = "tubularbell";
		this.evt = {
            btDemarrer: {
                click: function() {
                    var temps = document.getElementById("temps");
					var sec = Chrono.prendreDuree();
					if (sec) {
						temps.ajuster(sec);
						temps.interval = window.setInterval(this.obj.intTemps, 100);
						document.getElementById("son").setAttribute("src", "");
						this.setAttribute("disabled", "disabled");
						this.obj.btPause.removeAttribute('disabled');
						this.obj.btArreter.removeAttribute('disabled');
						this.obj.duree.setAttribute("disabled", "disabled");
					}
                }
            },
            btArreter: {
                click: function() {
                    var temps = document.getElementById("temps");
					window.clearInterval(temps.interval);
					temps.duree = 0;
					this.obj.appliquerTemps();
					// $temps[0].ajuster();
					document.getElementById("son").setAttribute("src", "");
					this.setAttribute("disabled", "disabled");
					this.obj.btPause.setAttribute("disabled", "disabled");
					this.obj.btRedemarrer.setAttribute("disabled", "disabled");
					this.obj.btDemarrer.removeAttribute("disabled");
					this.obj.duree.removeAttribute("disabled");
                }
            },
            btPause: {
                click: function() {
                    var temps = document.getElementById("temps");
					this.setAttribute("disabled", "disabled");
					this.obj.btRedemarrer.removeAttribute("disabled");
					window.clearInterval(temps.interval);
                }
            },
            btRedemarrer: {
                click: function() {
                    var temps = document.getElementById("temps");
					this.obj.btPause.removeAttribute("disabled");
					this.setAttribute("disabled", "disabled");
					temps.ajuster(temps.duree);
					temps.interval = window.setInterval(this.obj.intTemps, 400);
                }
            }
        };
        window.addEventListener("load", function () {
            Chrono.load();
        });
    }
}
Chrono.init();
