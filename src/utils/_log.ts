type LogType =
  | 'assert'
  | 'assert'
  | 'clear'
  | 'clear'
  | 'context'
  | 'context'
  | 'count'
  | 'count'
  | 'countReset'
  | 'countReset'
  | 'debug'
  | 'dir'
  | 'dir'
  | 'dirxml'
  | 'dirxml'
  | 'error'
  | 'exception'
  | 'exception'
  | 'group'
  | 'group'
  | 'groupCollapsed'
  | 'groupCollapsed'
  | 'groupEnd'
  | 'groupEnd'
  | 'info'
  | 'log'
  | 'memory'
  | 'memory'
  | 'profile'
  | 'profile'
  | 'profileEnd'
  | 'profileEnd'
  | 'table'
  | 'table'
  | 'time'
  | 'time'
  | 'timeEnd'
  | 'timeEnd'
  | 'timeLog'
  | 'timeLog'
  | 'timeStamp'
  | 'timeStamp'
  | 'trace'
  | 'trace'
  | 'warn';

export const _log = (message: string, value?: any, type: LogType = 'log') => {
  let colorByType = '';

  switch (type) {
    case 'log':
      colorByType = '#2980b9';
      break;
    case 'error':
      colorByType = '#e74c3c';
      break;
    case 'warn':
      colorByType = '#d35400';
      break;
    default:
      colorByType = '#01a3a4';
      break;
  }

  return (console as any)[type](
    `%c${message}`,
    `background: #ecf0f1; color: ${colorByType}`,
    value,
  );
};
