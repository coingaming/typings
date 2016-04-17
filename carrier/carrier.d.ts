import * as tls from 'tls';
import * as events from 'events';
export function carry(conn: tls.ClearTextStream, callback?: Function): events.EventEmitter;
