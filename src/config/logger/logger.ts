import winston, {Logger, format, createLogger, transports} from "winston";


const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors);

const logger:Logger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.splat(),
    format.colorize({ all: true }),
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
    format.printf((x:any) =>`${x.timestamp} ${x.level}: ${x.message}`)),
  transports: [new transports.Console()],
});


export default logger;
