<template>
	<div class="nombre">
		<chiffre :digit="dizaines"/>
		<chiffre :digit="unites"/>
	</div>
</template>
<style lang="scss">

</style>
<script>
import Chiffre from "./Chiffre";
export default {
	props: [
		"nombre",
	],
	computed: {
		dizaines() {
			return Math.floor(this.nombre/10);
		},
		unites() {
			return this.nombre%10;
		},
	},
	components: {
		Chiffre,
	}
}
</script>