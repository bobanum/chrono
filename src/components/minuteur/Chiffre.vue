<template>
	<svg class="chiffre" viewport="0 0 54 100" width=".54em" height="1em">
		<use fill="red" fill-opacity=".2" :href="url(8)"/>
		<use fill="red" :href="href"/>
	</svg>
</template>
<style lang="scss">

</style>
<script>
export default {
	props: [
		"digit",
	],
	methods: {
		url(n) {
			return '/images/chiffresdel.svg#n' + n;			
		}
	},
	computed: {
		href() {
			return this.url(this.digit);
		},
	},
}
</script>