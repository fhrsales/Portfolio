<script>
	// Props
	export let classe = '';
    export let estilo = '';
	export let handleClick = null; // function that should return true on success
	export let value = '';
	export let newValue = '';
	export let resetAfter = 1000; // ms to revert label

	// local state
	let displayed = value;
	let original = value;
	let revertTimer;

	// keep displayed in sync if parent changes `value` externally
	$: if (value !== undefined && value !== null && value !== original) {
		original = value;
		displayed = value;
	}

	async function onClick(event) {
		// Call handler and await result
		let ok = false;
		try {
			if (typeof handleClick === 'function') {
				const res = handleClick(event);
				ok = res && typeof res.then === 'function' ? await res : res;
			}
		} catch (e) {
			ok = false;
		}

		// Only update when handler explicitly returned true
		if (ok === true && newValue) {
			displayed = newValue;
			// clear previous timer
			if (revertTimer) clearTimeout(revertTimer);
			revertTimer = setTimeout(() => {
				displayed = original;
			}, resetAfter);
		}
	}
</script>

<button type="button" class={classe} style={estilo} on:click={onClick}>
	{displayed}
</button>

<style>
	/* minimal styling left to the caller */
</style>