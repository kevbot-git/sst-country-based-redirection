import type { SSTConfig } from 'sst';
import { SvelteKitSite, Function } from 'sst/constructs';
import { SiteRegionDetector } from './src/stack/constructs/SiteRegionDetector'
import type { SupportedAppRegion } from './src/lib'

export default {
  config(_input) {
    return {
      name: 'sst-playground',
      region: 'us-east-1',
      stage: 'kev'
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {

      const site = new SvelteKitSite(stack, 'site');

      const siteRegionDetector = new SiteRegionDetector<SupportedAppRegion>(stack, 'RegionDetector', {
        site,
        regionToCountryMap: {
          fallback: 'au',
          au: ['AU', 'NZ'],
          uk: ['GB'],
        }
      })
      
      stack.addOutputs({
        url: site.url,
      });
    });
  },
} satisfies SSTConfig;
