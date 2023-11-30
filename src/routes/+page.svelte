<script>
	import { supportedAppRegions } from '$lib/utils'
</script>

<h1>Welcome to my site!</h1>

<p>
    This is the root of the site, and is not region-specific.
</p>

<p>
    For the purpose of automatic region redirection, we don’t really want to see this page.
</p>

<h2>Regions</h2>

<ul>
    {#each supportedAppRegions as region}
        <li><a href={`/${region}`}><strong>{region}</strong> subpath</a></li>
    {/each}
</ul>