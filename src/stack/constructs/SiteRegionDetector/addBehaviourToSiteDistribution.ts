import { FunctionEventType, type Distribution, OriginRequestPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import type { RedirectFunction } from './RedirectFunction';
import type { Site } from './types';

interface AddBehaviorToSiteDistributionParams<TSupportedRegion extends string> {
    site: Site,
    redirectFunction: RedirectFunction<TSupportedRegion>,
}

export function addBehaviorToSiteDistribution<TSupportedRegion extends string>({ site, redirectFunction }: AddBehaviorToSiteDistributionParams<TSupportedRegion>) {
    if (!site.cdk?.distribution) {
        throw new Error(`Could not access distribution for StaticSite with ID: ${site.id}`)
    }

    (site.cdk.distribution as Distribution).addBehavior('/', new S3Origin(site.cdk.bucket), {
        functionAssociations: [
          {
            eventType: FunctionEventType.VIEWER_REQUEST,
            function: redirectFunction,
          }
        ],
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      })
}