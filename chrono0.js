window.onload = function() {
  document.body.appendChild(creerTemps());
  document.body.appendChild(creerFormulaire());
  document.body.appendChild(creerSon());
}
function creerTemps() {
  var temps = document.createElement("div");
  temps.id = "temps";
  temps.heures = temps.appendChild(document.createElement("span"));
  temps.heures.id = "heures";
  temps.heures.innerHTML = "00";
  temps.appendChild(document.createTextNode(":"));
  temps.minutes = temps.appendChild(document.createElement("span"));
  temps.minutes.id = "minutes";
  temps.minutes.innerHTML = "00";
  temps.appendChild(document.createTextNode(":"));
  temps.secondes = temps.appendChild(document.createElement("span"));
  temps.secondes.id = "secondes";
  temps.secondes.innerHTML = "00";
  temps.ajuster = ajusterTemps;
  return temps;
}
function creerFormulaire() {
  var form = document.createElement("form");
  form.id = form.name = "duree";
  form.appendChild(document.createTextNode("Durée : "));
  form.appendChild(creerSelect("selectheures",0,5));
  form.appendChild(creerSelect("selectminutes"));
  form.appendChild(creerSelect("selectsecondes",0,60,5));
  form.appendChild(creerBoutonDemarrer());
  form.appendChild(creerBoutonPause());
  form.appendChild(creerSelectSon(["Heyhey", "Tubular Bell", "Sabre Dance", "Holiday", "Borderline", "Lucky Star", "Tarkus", "James Bond"],"tubularbell"));
  return form;
}
function creerSelect(nom, debut, fin, value) {
  value = value || 0;
  fin = fin || 60;
  debut = debut || 0;
  var select = document.createElement("select");
  select.name = select.id = nom;
  for (var i=debut; i<=fin; i++) {
    var option = select.appendChild(document.createElement("option"));
    option.value = i;
    if (value==i) option.selected = "selected";
    var texte = "00"+i;
    option.text = texte.substr(-2);
  }
  return select;
}
function creerBoutonDemarrer() {
  var bt = document.createElement("input");
  bt.id = "btDemarrer";
  bt.type = "button";
  bt.onclick = clicDemarrer;
  bt.value = "Démarrer";
  return bt;
}
function creerBoutonPause() {
  var bt = document.createElement("input");
  bt.id = "btPause";
  bt.type = "button";
  bt.onclick = clicPause;
  bt.value = "Pause";
  bt.disabled = true;
  return bt;
}
function creerSelectSon(liste, defaut) {
  defaut = defaut || "";
  var select = document.createElement("select");
  select.name = select.id = "choixson";
  for (var i=0; i<liste.length; i++) {
    var option = select.appendChild(document.createElement("option"));
    option.value = liste[i].replace(" ", "").toLowerCase();
    if (defaut==option.value) option.selected = "selected";
    var texte = liste[i];
    option.text = texte;
  }
  return select;
}
function clicDemarrer(){
  var pause = document.getElementById("btPause");
  var temps = document.getElementById("temps");
  if (this.value == "Démarrer") {
    var sec = document.getElementById("selectheures").value*3600;
    sec += document.getElementById("selectminutes").value*60;
    sec += document.getElementById("selectsecondes").value*1;
    if (sec) {
      this.value = "Arrêter";
      pause.disabled = false;
      temps.ajuster(sec*1000);
      temps.interval = window.setInterval(intTemps, 500);
      var son = document.getElementById("son");
      son.src = "";
    }
  }else{
    this.value = "Démarrer";
    window.clearInterval(temps.interval);
    temps.duree = 0;
    temps.ajuster();
    var son = document.getElementById("son");
    son.src = "";
    pause.value = "Pause";
    pause.disabled = true;
  }
}
function clicPause(){
  var temps = document.getElementById("temps");
  if (this.value == "Pause") {
    this.value = "Redémarrer";
    window.clearInterval(temps.interval);
  }else{
    this.value = "Pause";
    temps.ajuster(temps.duree);
    temps.interval = window.setInterval(intTemps, 400);
  }
}
function creerSon(){
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
  obj.id = "son";
	obj.type="audio/midi";
	obj.width=0 ;
	obj.height=0;
  ajouterAttribut(obj, "src", "");
  ajouterAttribut(obj, "controller", false);
  ajouterAttribut(obj, "hidden", true);
  ajouterAttribut(obj, "autoplay", true);
  ajouterAttribut(obj, "volume", 100);
  return obj;
}
function ajouterAttribut(objet,nom,valeur) {
  var att = document.createAttribute(nom);
  att.value = valeur;
  objet.attributes.setNamedItem(att);
}
function intTemps() {
  var temps = document.getElementById("temps");
  temps.ajuster();
  if (temps.duree <= 0) {
    temps.duree = 0;
    temps.ajuster();
    var son = document.getElementById("son");
    son.src = document.getElementById("choixson").value + ".mid";
    window.clearInterval(temps.interval);
  }
}
function ajusterTemps(duree){
  if (duree != undefined) {
    this.duree = duree;
    this.debut = new Date()*1;
    this.fin = this.duree + this.debut;
  }else if (this.duree > 0) {
    this.duree = this.fin - (new Date()*1);
  }else{
    this.duree = 0;
  }
  duree = Math.floor(this.duree/1000);
  var h = Math.floor(duree/3600);
  h = "00" + h;
  h = h.substr(h.length-2);
  this.heures.innerHTML = h;

  duree %= 3600
  var m = Math.floor(duree/60);
  m = "00" + m;
  m = m.substr(m.length-2);
  this.minutes.innerHTML = m;

  duree %= 60;
  var s = duree;
  s = "00" + s;
  s = s.substr(s.length-2);
  this.secondes.innerHTML = s;
}

