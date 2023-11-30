import { Function, FunctionCode } from 'aws-cdk-lib/aws-cloudfront';
import type { Construct } from 'constructs';
import type { RegionToCountryMap } from './types';
import { CodeBuilder } from './CodeBuilder';

/**
 * Given a union type of supported regions, returns a map of regions to countries
 * @example mapRegionsToCountries<'au', 'uk'>({ fallback: 'US', au: ['AU', 'NZ'], uk: ['UK'] })
 * @returns 
 */
export function mapRegionsToCountries<TSupportedRegion extends string>(map: RegionToCountryMap<TSupportedRegion>) {
    return map;
}

export class RedirectFunction<TSupportedRegion extends string> extends Function {
    constructor(scope: Construct, id: string, regionToCountryMap: RegionToCountryMap<TSupportedRegion>) {
        super(scope, id, {
            code: FunctionCode.fromInline(CodeBuilder.build(regionToCountryMap))
        })
    }
}

// Uncomment to verify using ts-node
/**
const code = CodeBuilder.build(mapRegionsToCountries<'au' | 'uk'>({
    fallback: 'au',
    au: ['AU', 'NZ'],
    uk: ['GB'],
}))

console.log(code);
*/