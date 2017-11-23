$().ready(function () {
	$('body')
		.append(creerFormulaire())
		.append(creerTemps())
		.append(creerSon())
	;
	appliquerTemps();
});
function creerTemps() {
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
		)
	;
  temps[0].ajuster = ajusterTemps;
  return temps;
}
function creerFormulaire() {
  var form = $(document.createElement("form"))
		.attr("id", "duree")
		.attr("name", "duree")
		.css("text-align","center")
		.append($(document.createElement("span")).text("Durée : "))
		.append(creerSelect("selectheures",0,5).addClass("selectduree"))
		.append(creerSelect("selectminutes",0,60,3).addClass("selectduree"))
		.append(creerSelect("selectsecondes",0,60,0).addClass("selectduree"))
		.append(creerBoutonDemarrer())
		.append(creerBoutonPause())
		.append(creerSelectSon(["Heyhey", "Tubular Bell", "Sabre Dance", "Holiday", "Borderline", "Lucky Star", "Tarkus", "James Bond"],"tubularbell"))
	;
  return form;
}
function creerSelect(nom, debut, fin, value) {
  value = value || 0;
  fin = fin || 60;
  debut = debut || 0;
  var select = $(document.createElement("select"))
		.attr("id",nom)
		.attr("name",nom)
	;
  for (var i=debut; i<=fin; i++) {
    select.append($(document.createElement("option"))
			.attr("value", i)
			.text(("00"+i).substr(("00"+i).length-2))
		);
  }
	select.val(value).bind("change", appliquerTemps);
  return select;
}
function creerBoutonDemarrer() {
  return $(document.createElement("input"))
		.attr("id", "btDemarrer")
		.attr("type", "button")
		.attr("value", "Démarrer")
		.attr("accesskey", "D")
		.bind("click", clicDemarrer)
	;
}
function creerBoutonPause() {
  return $(document.createElement("input"))
		.attr("id", "btPause")
		.attr("type", "button")
		.attr("value", "Pause")
		.attr("disabled", "disabled")
		.attr("accesskey", "P")
		.bind("click", clicPause)
	;
}
function creerSelectSon(liste, defaut) {
	defaut = defaut || "";
  var select = $(document.createElement("select"))
		.attr("id","choixson")
		.attr("name","choixson")
	;
  for (var i=0; i<liste.length; i++) {
    var nomson = liste[i].replace(" ", "").toLowerCase();
		select.append($(document.createElement("option"))
			.attr("value", nomson)
			.text(liste[i])
		);
  }
	select.val(defaut)
  return select;
}
function clicDemarrer(){
  var $pause = $("#btPause");
  var $temps = $("#temps");
  if (this.value == "Démarrer") {
    var sec = prendreDuree();
    if (sec) {
      this.value = "Arrêter";
      $pause.removeAttr('disabled');
      $temps[0].ajuster(sec);
      $temps[0].interval = window.setInterval(intTemps, 100);
      $("#son").attr("src","")
			$("#duree .selectduree").attr("disabled","disabled")
    }
  }else{
    this.value = "Démarrer";
    window.clearInterval($temps[0].interval);
    $temps[0].duree = 0;
		appliquerTemps();
    // $temps[0].ajuster();
    $("#son").attr("src","")
    $pause.val("Pause").attr("disabled","disabled");
		$("#duree .selectduree").removeAttr("disabled")
  }
}
function clicPause(){
  var $temps = $("#temps");
  if (this.value == "Pause") {
    this.value = "Redémarrer";
    window.clearInterval($temps[0].interval);
  }else{
    this.value = "Pause";
    $temps[0].ajuster($temps.duree);
    $temps[0].interval = window.setInterval(intTemps, 400);
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
  var obj = $(document.createElement("embed"))
		.attr({
			id:"son",
			type:"audio/midi",
			width:0,
			height:0,
			src:"",
			controller:false,
			hidden:true,
			autoplay:true,
			volume:100,
		})
	;
  return obj;
}
function intTemps() {
  var $temps = $("#temps");
  $temps[0].ajuster();
  if ($temps[0].duree <= 0) {
    $temps[0].duree = 0;
    $temps[0].ajuster();
    $("#son").attr("src","sons/" + ($("#choixson").val()) + ".mid");
    window.clearInterval($temps[0].interval);
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
  appliquerTemps(duree);
}
function appliquerTemps(temps) {
  if (isNaN(temps)) temps = prendreDuree()/1000;
	var h = Math.floor(temps/3600);
  h = "00" + h;
  h = h.substr(h.length-2);
  $('#heures').text(h);

  temps %= 3600
  var m = Math.floor(temps/60);
  m = "00" + m;
  m = m.substr(m.length-2);
  $('#minutes').text(m);

  temps %= 60;
  var s = temps;
  s = "00" + s;
  s = s.substr(s.length-2);
  $('#secondes').text(s);
}
function prendreDuree() {
	var sec = $("#selectheures").val()*3600;
	sec += $("#selectminutes").val()*60;
	sec += $("#selectsecondes").val()*1;
	return sec*1000;
}
