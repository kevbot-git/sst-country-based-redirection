import type { RegionToCountryMap } from './types';

export abstract class CodeBuilder {
    static build<TSupportedRegion extends string>(regionToCountryMap: RegionToCountryMap<TSupportedRegion>) {
        return [
            this.buildRegionGetterFunction(regionToCountryMap),
            this.handlerFunction,
        ].join('\n');
    }

    private static handlerFunction = `
        function handler(event) {
            var request = event.request;
            var requestCountry = (request.headers['cloudfront-viewer-country'] || {}).value;
            var regionForCountry = getRegionForCountryCode(requestCountry);
            var host = request.headers.host.value;
            
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
    `;

    private static buildRegionGetterFunction(regionToCountryMap: RegionToCountryMap<string>) {
        const { fallback, ...regionMaps } = regionToCountryMap;

        const fallbackReturnStatement = `return '${fallback}';`;

        if (!regionMaps) return fallbackReturnStatement;

        const caseStatements = [
            ...Object.entries(regionMaps)
                .reduce<string[]>((lines, [region, countries]) => {
                    if (!countries) return lines;
                    return [
                        ...lines,
                        ...countries.map((country) => `case '${country}':`),
                        `return '${region}';`
                    ];
                }, []),
            'default:',
            fallbackReturnStatement,
        ];

        return [
            'function getRegionForCountryCode(code) {',
            'switch(code) {',
            ...caseStatements,
            '}',
            '}',
        ].join('\n');
    }
}