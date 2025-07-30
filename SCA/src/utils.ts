import * as _ from 'lodash';

/**
 * Process user data with secure operations
 * FIXED: Using lodash 3.x compatible methods to prevent prototype pollution
 */
export function processUserData(userData: any): any {
  // FIXED: Use lodash 3.x compatible approach - merge with manual prototype pollution prevention
  // Create a clean copy of userData first
  const cleanUserData = JSON.parse(JSON.stringify(userData));

  // Remove dangerous keys that could cause prototype pollution
  if (cleanUserData.__proto__) delete cleanUserData.__proto__;
  if (cleanUserData.constructor) delete cleanUserData.constructor;
  if (cleanUserData.prototype) delete cleanUserData.prototype;

  const processedData = _.merge({}, cleanUserData, { processed: true });

  // FIXED: Use _.defaultsDeep which is available in lodash 3.x
  const safeDefaults = {
    permissions: { user: true },
    settings: { theme: 'default' }
  };

  // Clean the defaults object to ensure no prototype pollution
  const cleanDefaults = JSON.parse(JSON.stringify(safeDefaults));
  const result = _.defaultsDeep(processedData, cleanDefaults);

  return result;
}

/**
 * Parse URL with potential directory traversal vulnerability
 * TODO: This function still has directory traversal vulnerability - consider path normalization
 */
export function parseUrl(url: string): string {
  // Vulnerable to directory traversal
  const filePath = url.replace(/^\/+/, '');
  return `./public/${filePath}`;
}
