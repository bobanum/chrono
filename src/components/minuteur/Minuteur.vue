<template>
	<div class="minuteur">
		<cadran :timestamp="secondes(depart.getTime())"/>
	</div>
</template>

<style lang="scss">

</style>

<script>
import Cadran from "./Cadran";
export default {
	data() {
		return {
			actif: true,
			duree: 3*60,
			depart: new Date(),
		};
	},
	props: [
	],
	methods: {
		secondes(timestamp) {
			timestamp -= (new Date().getTimezoneOffset()) * 60000;
			return Math.floor(timestamp/1000)%(60*60*24)
		}
	},
	components: {
		Cadran,
	}
}
</script>