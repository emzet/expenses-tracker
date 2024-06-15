/**
 *  Prints application info to the browser console
 *
 *  @param {string} appName - human readable name of application
 *  @param {string} appVersion - current version of application
 *  @param {string} buildDateTime - human readable formated date and time of application build
 *  @return {void}
 */
export const logAppInfo = (appName: string, appVersion: string, buildDateTime: string): void => {
  const output = `%c ${appName} %c ${appVersion} %c ${buildDateTime} `;

  const styles: ReadonlyArray<string> = [
    'background-color: #5a00ff; border-radius: 3px 0 0 3px; color: #fff; padding: 3px 1px; border: 1px solid #5a00ff',
    'background-color: rgb(242, 242, 242); border-radius: 0; color: #000; padding: 3px 1px; border: 1px solid #000',
    'background-color: #101828; border-radius: 0 3px 3px 0; color: #fff; padding: 3px 1px; border: 1px solid #101828'
  ];

  console.info(output, ...styles);
};
