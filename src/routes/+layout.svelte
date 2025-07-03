
<script>
	import '../app.css';
	import Menu from '$lib/components/Menu.svelte';
	let { children } = $props();
</script>

<Menu />
<div class="main-content">
	{@render children()}
</div>
