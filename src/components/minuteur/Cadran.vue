<template>
	<div class="cadran">
		<nombre :nombre="heures"/>
		<separateur/>
		<nombre :nombre="minutes"/>
		<separateur/>
		<nombre :nombre="secondes"/>
	</div>
</template>
<style lang="scss">
.cadran {
	font-size: 15vw;
	display:grid;
	grid-auto-flow: column;
	justify-content: center;
	grid-gap: .25em;
	.nombre {
		display: contents;
	}
}
</style>
<script>
import Nombre from "./Nombre";
import Separateur from "./Separateur";
export default {
	data() {
		return {
		};
	},
	components: {
		Nombre,
		Separateur,
	},
	computed: {
		heures() {
			if (this.t) {
				return this.t.getHours();
			} else if (this.timestamp) {
				return Math.floor(this.timestamp / (60 * 60));
			} else if (this.h) {
				return this.h;
			}
			return 0;
		},
		minutes() {
			if (this.t) {
				return this.t.getMinutes();
			} else if (this.timestamp) {
				return Math.floor(this.timestamp / 60) % 60;
			} else if (this.m) {
				return this.m;
			}
			return 0;
		},
		secondes() {
			if (this.t) {
				return this.t.getSecondes();
			} else if (this.timestamp) {
				return this.timestamp % 60;
			} else if (this.s) {
				return this.s;
			}
			return 0;
		},
	},
	props: {
		"t": {
			type: Date,
			default: null,
		},
		"timestamp": {
			type: Number,
			default: 0,
		},
		"h": {
			type: Number,
			default: 0,
		},
		"m": {
			type: Number,
			default: 0,
		},
		"s": {
			type: Number,
			default: 0,
		},
	}
}
</script>