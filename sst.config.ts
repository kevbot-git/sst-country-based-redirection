import type { SSTConfig } from 'sst';
import { SvelteKitSite } from 'sst/constructs';

export default {
  config(_input) {
    return {
      name: 'sst-playground',
      region: 'ap-southeast-2',
      stage: 'kev'
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {

      const site = new SvelteKitSite(stack, 'site');
      
      stack.addOutputs({
        url: site.url,
      });
    });
  },
} satisfies SSTConfig;
