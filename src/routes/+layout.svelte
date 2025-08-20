
<script>
	import '../app.css';
	import Menu from '$lib/components/Menu.svelte';
	let { children } = $props();
</script>


<Menu />
<div class="main-content">
	{@render children()}
</div>

<footer class="footer">
	<div class="icons">
		Contacts: <a href="mailto:fabio.sales@me.com" title="Email" target="_blank" rel="noopener">fabio.sales@me.com</a> | 
		<a href="https://www.linkedin.com/in/fabiohrsales/" title="LinkedIn" target="_blank" rel="noopener">LinkedIn</a>
	</div>
</footer>