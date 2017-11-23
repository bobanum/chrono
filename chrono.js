/*jslint browser:true, esnext:true*/
/*exported Chrono*/
/*globals $*/
class Chrono {

    static creerTemps() {
        var temps = $(document.createElement("div"))
            .attr("id", "temps")
            .append($(document.createElement("span"))
                .attr("id", "heures")
                .addClass("temps")
                .html("00")
            )
            .append($(document.createElement("span")).html(":"))
            .append($(document.createElement("span"))
                .attr("id", "minutes")
                .addClass("temps")
                .html("00")
            )
            .append($(document.createElement("span")).html(":"))
            .append($(document.createElement("span"))
                .attr("id", "secondes")
                .addClass("temps")
                .html("00")
            );
        temps[0].ajuster = this.ajusterTemps;
        return temps;
    }

    static creerFormulaire() {
        var form = $(document.createElement("form"))
            .attr("id", "duree")
            .attr("name", "duree")
            .css("text-align", "center")
            .append($(document.createElement("span")).text("Durée : "))
            .append(this.creerSelect("selectheures", 0, 5).addClass("selectduree"))
            .append(this.creerSelect("selectminutes", 0, 60, 3).addClass("selectduree"))
            .append(this.creerSelect("selectsecondes", 0, 60, 0).addClass("selectduree"))
            .append(this.creerBoutonDemarrer())
            .append(this.creerBoutonPause())
            .append(this.creerSelectSon(["Heyhey", "Tubular Bell", "Sabre Dance", "Holiday", "Borderline", "Lucky Star", "Tarkus", "James Bond"], "tubularbell"));
        return form;
    }

    static creerSelect(nom, debut, fin, value) {
        value = value || 0;
        fin = fin || 60;
        debut = debut || 0;
        var select = $(document.createElement("select"))
            .attr("id", nom)
            .attr("name", nom);
        for (var i = debut; i <= fin; i++) {
            select.append($(document.createElement("option"))
                .attr("value", i)
                .text(("00" + i).substr(("00" + i).length - 2))
            );
        }
        select.val(value).bind("change", this.appliquerTemps);
        return select;
    }

    static creerBoutonDemarrer() {
        return $(document.createElement("input"))
            .attr("id", "btDemarrer")
            .attr("type", "button")
            .attr("value", "Démarrer")
            .attr("accesskey", "D")
            .bind(this.evt.demarrer);
    }

    static creerBoutonPause() {
        return $(document.createElement("input"))
            .attr("id", "btPause")
            .attr("type", "button")
            .attr("value", "Pause")
            .attr("disabled", "disabled")
            .attr("accesskey", "P")
            .bind(this.evt.pause);
    }

    static creerSelectSon(liste, defaut) {
        defaut = defaut || "";
        var select = $(document.createElement("select"))
            .attr("id", "choixson")
            .attr("name", "choixson");
        for (var i = 0; i < liste.length; i++) {
            var nomson = liste[i].replace(" ", "").toLowerCase();
            select.append($(document.createElement("option"))
                .attr("value", nomson)
                .text(liste[i])
            );
        }
        select.val(defaut);
        return select;
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
        var obj = $(document.createElement("embed"))
            .attr({
                id: "son",
                type: "audio/midi",
                width: 0,
                height: 0,
                src: "",
                controller: false,
                hidden: true,
                autoplay: true,
                volume: 100,
            });
        return obj;
    }

    static intTemps() {
        var $temps = $("#temps");
        $temps[0].ajuster();
        if ($temps[0].duree <= 0) {
            $temps[0].duree = 0;
            $temps[0].ajuster();
            $("#son").attr("src", "sons/" + ($("#choixson").val()) + ".mid");
            window.clearInterval($temps[0].interval);
        }
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
        var h = Math.floor(temps / 3600);
        h = "00" + h;
        h = h.substr(h.length - 2);
        $('#heures').text(h);

        temps %= 3600;
        var m = Math.floor(temps / 60);
        m = "00" + m;
        m = m.substr(m.length - 2);
        $('#minutes').text(m);

        temps %= 60;
        var s = temps;
        s = "00" + s;
        s = s.substr(s.length - 2);
        $('#secondes').text(s);
    }

    static prendreDuree() {
        var sec = $("#selectheures").val() * 3600;
        sec += $("#selectminutes").val() * 60;
        sec += $("#selectsecondes").val() * 1;
        return sec * 1000;
    }
    static load() {
        $('body')
            .append(this.creerFormulaire())
            .append(this.creerTemps())
            .append(this.creerSon());
        this.appliquerTemps();
    }

    static init() {
        this.evt = {
            demarrer: {
                click: function() {
                    var $pause = $("#btPause");
                    var $temps = $("#temps");
                    if (this.value === "Démarrer") {
                        var sec = Chrono.prendreDuree();
                        if (sec) {
                            this.value = "Arrêter";
                            $pause.removeAttr('disabled');
                            $temps[0].ajuster(sec);
                            $temps[0].interval = window.setInterval(Chrono.intTemps, 100);
                            $("#son").attr("src", "");
                            $("#duree .selectduree").attr("disabled", "disabled");
                        }
                    } else {
                        this.value = "Démarrer";
                        window.clearInterval($temps[0].interval);
                        $temps[0].duree = 0;
                        Chrono.appliquerTemps();
                        // $temps[0].ajuster();
                        $("#son").attr("src", "");
                        $pause.val("Pause").attr("disabled", "disabled");
                        $("#duree .selectduree").removeAttr("disabled");
                    }
                }
            },
            pause: {
                click: function() {
                    var $temps = $("#temps");
                    if (this.value === "Pause") {
                        this.value = "Redémarrer";
                        window.clearInterval($temps[0].interval);
                    } else {
                        this.value = "Pause";
                        $temps[0].ajuster($temps.duree);
                        $temps[0].interval = window.setInterval(Chrono.intTemps, 400);
                    }
                }
            }
        };
        $().ready(function () {
            Chrono.load();
        });
    }
}
Chrono.init();
