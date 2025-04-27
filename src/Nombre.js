class Nombre extends HTMLElement {
	constructor(value = 0) {
		super();
		this._value = value;
		this.attachShadow({ mode: 'open' });
	}
	get value() {
		return this._value;
	}
	set value(value) {
		if (this._value === value) return;
		this._value = value;
		if (!this.isConnected) return;
		
		this.innerHTML = "";
		this.appendChild(this.DOM.digits(value));
	}
	
	connectedCallback() {
		this.shadowRoot.appendChild(this.DOM.main());
	}
	DOM = {
		main: () => {
			var resultat = document.createElement("slot");
			return resultat;
		},
		style: () => {
			var resultat = document.createElement("link");
			resultat.setAttribute("rel", "stylesheet");
			resultat.setAttribute("href", "css/nombre.css");
			return resultat;		
		},
		digits: (value) => {
			var resultat, span;
			resultat = document.createDocumentFragment();
			let v = value.toString().padStart(2, "0").split("");
			console.log(v);
			
			v.forEach((digit, i) => {
				span = resultat.appendChild(document.createElement("span"));
				span.classList.add("digit");
				span.style.gridRow = 1;
				span.style.gridColumn = i + 1;
				span.innerHTML = digit;
			});
			return resultat;
		},
	};
}

customElements.define('chrono-nombre', Nombre);