/**
 *  Converts package name to human readable string
 *
 *  @param {string} packageName - name from package.json
 *  @return {string} human readable string
 */
export const sanitizeAppName = (packageName: string): string => {
  return packageName
    .replace(/@/g, '')
    .split('/')[0]
    .split(/-/)
    .map((word: string) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ');
}
