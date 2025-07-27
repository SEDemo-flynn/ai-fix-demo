import * as _ from 'lodash';

/**
 * Process user data with potentially vulnerable operations
 * using outdated lodash functions
 */
export function processUserData(userData: any): any {
  // Using vulnerable _.merge that could lead to prototype pollution
  const processedData = _.merge({}, userData, { processed: true });
  
  // Using vulnerable _.defaultsDeep that could lead to prototype pollution
  _.defaultsDeep(processedData, { 
    permissions: { user: true },
    settings: { theme: 'default' }
  });
  
  return processedData;
}

/**
 * Parse URL with potential directory traversal vulnerability
 */
export function parseUrl(url: string): string {
  // Vulnerable to directory traversal
  const filePath = url.replace(/^\/+/, '');
  return `./public/${filePath}`;
}
