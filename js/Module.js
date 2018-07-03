/*jslint esnext:true, browser:true*/
/*globals App*/
/*exported Module*/
class Module {
	constructor() {
		this._dom = null;
	}
	get dom() {
		if (!this._dom) {
			this._dom = this.dom_creer();
		}
		return this._dom;
	}
	static init() {
		this.evt = {

		};
	}
}
Module.init();
