<script>
 export let value = '';
</script>

<p class="eyebrow">{value}</p>

<style>
 .eyebrow {
  font-family: var(--font-primary);
  font-size: calc(var(--grid) * 1.5);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--color-primary);
  width: calc(100% - (var(--grid) * 4));
  max-width: calc(var(--grid) * 50);
  margin: 0 auto calc(var(--grid) * .8);
 }
</style>
