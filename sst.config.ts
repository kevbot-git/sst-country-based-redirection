import type { SSTConfig } from 'sst';
import { SvelteKitSite, Function } from 'sst/constructs';
import cloudfront from 'aws-cdk-lib/aws-cloudfront';
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

      const regionDetectorFunction = new cloudfront.experimental.EdgeFunction(stack, 'RegionDetector', {
        code: new TypeScriptCode('./src/stack/functions/regionDetector.ts'),
        handler: 'regionDetector.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
      });
      
      const originRequestPolicy = cloudfront.OriginRequestPolicy.ALL_VIEWER_AND_CLOUDFRONT_2022;
      // const originRequestPolicy = new cloudfront.OriginRequestPolicy(stack, 'RegionDetectorPolicy', {
      //   // headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList(
      //   //   'Cloudfront-Viewer-Country'
      //   // ),
      //   headerBehavior: cloudfront.OriginRequestHeaderBehavior.all(),
      // });

      (site.cdk.distribution as cloudfront.Distribution).addBehavior('/', new cloudfrontOrigins.S3Origin(site.cdk.bucket), {
        edgeLambdas: [
          {
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            functionVersion: regionDetectorFunction.currentVersion,
          }
        ],
        originRequestPolicy,
      })
      
      stack.addOutputs({
        url: site.url,
      });
    });
  },
} satisfies SSTConfig;
