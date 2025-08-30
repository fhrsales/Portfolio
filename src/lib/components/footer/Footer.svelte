<footer class="footer">
	<div class="icons">
		Contact • <a href="mailto:fabio.sales@me.com" title="Email" target="_blank" rel="noopener">fabio.sales@me.com</a> | 
		<a href="https://www.linkedin.com/in/fabiohrsales/" title="LinkedIn" target="_blank" rel="noopener">LinkedIn</a>
	</div>
</footer>

<style>
    .footer::before {
        content: '';
        display: block;
        height: 1px;
        background: color-mix(in srgb, var(--color-dark) 30%, transparent);
        margin: 2em auto;
        width: 120px;

    }

    .footer {
        width: 100vw;
        padding: 3em 0 2em 0;
        width: 100vw;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        margin: 0 auto calc(var(--grid) * 4) auto;
        text-align: center;
        font-family: var(--font-primary);
        font-size: calc(var(--grid) * 1.5);
        text-transform: uppercase;
    }
</style>