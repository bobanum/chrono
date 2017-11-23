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
        var resultat, fieldset;
		resultat = document.createElement("form");
		resultat.setAttribute("id", "duree");
		resultat.setAttribute("name", "duree");
		fieldset = resultat.appendChild(this.dom_duree());
		resultat.appendChild(this.dom_boutonDemarrer());
		resultat.appendChild(this.dom_boutonPause());
		resultat.appendChild(this.dom_selectSon(["Heyhey", "Tubular Bell", "Sabre Dance", "Holiday", "Borderline", "Lucky Star", "Tarkus", "James Bond"], "tubularbell"));
		this.form = resultat;
		resultat.obj = this;
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

    static dom_boutonDemarrer() {
        var resultat;
		resultat = document.createElement("input");
		resultat.setAttribute("id", "btDemarrer");
		resultat.setAttribute("type", "button");
		resultat.setAttribute("value", "Démarrer");
		resultat.setAttribute("accesskey", "D");
		resultat.addEventListener("click", this.evt.demarrer.click);
		return resultat;
    }

    static dom_boutonPause() {
        var resultat;
        resultat = document.createElement("input");
		resultat.setAttribute("id", "btPause");
		resultat.setAttribute("type", "button");
		resultat.setAttribute("value", "Pause");
		resultat.setAttribute("disabled", "disabled");
		resultat.setAttribute("accesskey", "P");
		resultat.addEventListener("click", this.evt.pause.click);
		return resultat;
    }

    static dom_selectSon(liste, defaut) {
        var resultat;
		defaut = defaut || "";
        resultat = document.createElement("select");
		resultat.setAttribute("id", "choixson");
		resultat.setAttribute("name", "choixson");
        for (let i = 0, n = liste.length; i < n; i += 1) {
            let nomson = liste[i].replace(" ", "").toLowerCase();
            let option = resultat.appendChild(document.createElement("option"));
		   option.setAttribute("value", nomson);
		   option.textContent = liste[i];
        }
        resultat.valul = defaut;
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
        this.evt = {
            demarrer: {
                click: function() {
                    var btPause = document.getElementById("btPause");
                    var temps = document.getElementById("temps");
                    if (this.value === "Démarrer") {
                        var sec = Chrono.prendreDuree();
                        if (sec) {
                            this.value = "Arrêter";
                            btPause.removeAttribute('disabled');
                            temps.ajuster(sec);
                            temps.interval = window.setInterval(Chrono.intTemps, 100);
                            document.getElementById("son").setAttribute("src", "");
                            Chrono.duree.setAttribute("disabled", "disabled");
                        }
                    } else {
                        this.value = "Démarrer";
                        window.clearInterval(temps.interval);
                        temps.duree = 0;
                        Chrono.appliquerTemps();
                        // $temps[0].ajuster();
                        document.getElementById("son").setAttribute("src", "");
                        btPause.value = "Pause";
						btPause.setAttribute("disabled", "disabled");
                        Chrono.duree.removeAttribute("disabled");
                    }
                }
            },
            pause: {
                click: function() {
                    var temps = document.getElementById("temps");
                    if (this.value === "Pause") {
                        this.value = "Redémarrer";
                        window.clearInterval(temps.interval);
                    } else {
                        this.value = "Pause";
                        temps.ajuster(temps.duree);
                        temps.interval = window.setInterval(Chrono.intTemps, 400);
                    }
                }
            }
        };
        window.addEventListener("load", function () {
            Chrono.load();
        });
    }
}
Chrono.init();
