<script>
	export let ariaLabel = '';
	export let pressed = false;
	export let disabled = false;
	export let title = '';
	export let icon = '';
</script>

<button disabled class="ds-btn" aria-label={ariaLabel} {title}>
	<slot />
</button>
