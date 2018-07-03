/*jslint browser:true, esnext:true*/
/*globals App, Module, Minuteur*/
class Horloge extends Module {
	static dom_menuItem() {
		return App.dom_menuItem("d", this.evt.menuAlarm);
	}
	static load() {
//		window.horloge = new this();
//		document.body.appendChild(window.horloge.dom);
//		window.horloge.header.appendChild(this.dom_menu());
	}
	static init() {
		App.modules.push(this);
		this.evt = {
			menu: {
				click: function () {
//					alert(1);
				}
			}
		};
		window.addEventListener("load", function () {
			Horloge.load();
		});
	}
}
Horloge.init();
