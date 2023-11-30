import type { SSTConfig } from 'sst';
import { SvelteKitSite, Function } from 'sst/constructs';
import cloudfront, { FunctionCode } from 'aws-cdk-lib/aws-cloudfront';
import cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import lambda, { Code } from 'aws-cdk-lib/aws-lambda';
import { TypeScriptCode } from '@mrgrain/cdk-esbuild'

export default {
  config(_input) {
    return {
      name: 'sst-playground',
      region: 'us-east-1',
      stage: 'kev'
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x'
    })

    app.stack(function Site({ stack }) {

      const site = new SvelteKitSite(stack, 'site');

      if (!site.cdk?.distribution) {
        console.error('Site distribution not accessible')
        return;
      }

      const regionDetectorFunction = new cloudfront.Function(stack, 'RegionDetector', {
        // code: new TypeScriptCode('./src/stack/functions/regionDetector.ts'),
        code: FunctionCode.fromInline(`
        function getRegionForCountryCode(code) {
          switch (code) {
              case 'UK':
                  return 'uk';
              case 'NZ':
              case 'AU':
              default:
                  return 'au';
          }
      }
      
      function handler(event) {
        const request = event.request;
        const requestCountry = (request.headers['cloudfront-viewer-country'] || {}).value;
        const regionForCountry = getRegionForCountryCode(requestCountry);
        const host = request.headers.host.value;
        
          return {
              statusCode: 302,
              statusDescription: 'Found',
              headers: {
                  location: {
                      value: \`https://\${host}/\${regionForCountry}\`
                  }
              }
          }
      
        return request;
      }
        `),
      });

      (site.cdk.distribution as cloudfront.Distribution).addBehavior('/', new cloudfrontOrigins.S3Origin(site.cdk.bucket), {
        functionAssociations: [
          {
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: regionDetectorFunction,
          }
        ],
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      })
      
      stack.addOutputs({
        url: site.url,
      });
    });
  },
} satisfies SSTConfig;
