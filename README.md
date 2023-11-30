# Example of country-based redirection for an SST website

This introduces an SST construct that can be added to a StaticSite, enabling navigation to the root of the site to redirect the user to configurable subpaths based on their location.

## Running

1. Install and configure `aws`
2. Run `npm run sst:deploy`
3. Navigate to the URL that is in the deployment output

## To do

- Make SiteRegionDetector available via `npm`