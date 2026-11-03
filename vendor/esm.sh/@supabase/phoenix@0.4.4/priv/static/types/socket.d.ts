/**
* @import { Encode, Decode, Message, Vsn, SocketTransport, Params, SocketOnOpen, SocketOnClose, SocketOnError, SocketOnMessage, SocketOptions, SocketStateChangeCallbacks, HeartbeatCallback } from "./types"
*/
export default class Socket {
    /** Initializes the Socket *
     *
     * For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
     *
     * @constructor
     * @param {string} endPoint - The string WebSocket endpoint, ie, `"ws://example.com/socket"`,
     *                                               `"wss://example.com"`
     *                                               `"/socket"` (inherited host & protocol)
     * @param {SocketOptions} [opts] - Optional configuration
     */
    constructor(endPoint: string, opts?: SocketOptions);
    /** @type{SocketStateChangeCallbacks} */
    stateChangeCallbacks: SocketStateChangeCallbacks;
    /** @type{Channel[]} */
    channels: Channel[];
    /** @type{(() => void)[]} */
    sendBuffer: (() => void)[];
    /** @type{number} */
    ref: number;
    /** @type{?string} */
    fallbackRef: string | null;
    /** @type{number} */
    timeout: number;
    /** @type{SocketTransport} */
    transport: SocketTransport;
    /** @type{InstanceType<SocketTransport> | undefined | null} */
    conn: InstanceType<SocketTransport> | undefined | null;
    /** @type{boolean} */
    primaryPassedHealthCheck: boolean;
    /** @type{number | undefined} */
    longPollFallbackMs: number | undefined;
    /** @type{ReturnType<typeof setTimeout>} */
    fallbackTimer: ReturnType<typeof setTimeout>;
    /** @type{Storage} */
    sessionStore: Storage;
    /** @type{number} */
    establishedConnections: number;
    /** @type{Encode<void>} */
    defaultEncoder: Encode<void>;
    /** @type{Decode<void>} */
    defaultDecoder: Decode<void>;
    /** @type{boolean} */
    closeWasClean: boolean;
    /** @type{boolean} */
    disconnecting: boolean;
    /** @type{BinaryType} */
    binaryType: BinaryType;
    /** @type{number} */
    connectClock: number;
    /** @type{boolean} */
    pageHidden: boolean;
    /** @type{Encode<void>} */
    encode: Encode<void>;
    /** @type{Decode<void>} */
    decode: Decode<void>;
    /** @type{number} */
    heartbeatIntervalMs: number;
    /** @type{boolean} */
    autoSendHeartbeat: boolean;
    /** @type{HeartbeatCallback} */
    heartbeatCallback: HeartbeatCallback;
    /** @type{(tries: number) => number} */
    rejoinAfterMs: (tries: number) => number;
    /** @type{(tries: number) => number} */
    reconnectAfterMs: (tries: number) => number;
    /** @type{((kind: string, msg: string, data: any) => void) | null} */
    logger: ((kind: string, msg: string, data: any) => void) | null;
    /** @type{number} */
    longpollerTimeout: number;
    /** @type{() => Params} */
    params: () => Params;
    /** @type{string} */
    endPoint: string;
    /** @type{Vsn} */
    vsn: Vsn;
    /** @type{ReturnType<typeof setTimeout>} */
    heartbeatTimeoutTimer: ReturnType<typeof setTimeout>;
    /** @type{ReturnType<typeof setTimeout>} */
    heartbeatTimer: ReturnType<typeof setTimeout>;
    /** @type{number | null} */
    heartbeatSentAt: number | null;
    /** @type{?string} */
    pendingHeartbeatRef: string | null;
    /** @type{Timer} */
    reconnectTimer: Timer;
    /** @type{string | undefined} */
    authToken: string | undefined;
    /**
     * Returns the LongPoll transport reference
     */
    getLongPollTransport(): typeof LongPoll;
    /**
     * Disconnects and replaces the active transport
     *
     * @param {SocketTransport} newTransport - The new transport class to instantiate
     *
     */
    replaceTransport(newTransport: SocketTransport): void;
    /**
     * Returns the socket protocol
     *
     * @returns {"wss" | "ws"}
     */
    protocol(): "wss" | "ws";
    /**
     * The fully qualified socket url
     *
     * @returns {string}
     */
    endPointURL(): string;
    /**
     * Disconnects the socket
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes for valid status codes.
     *
     * @param {() => void} [callback] - Optional callback which is called after socket is disconnected.
     * @param {number} [code] - A status code for disconnection (Optional).
     * @param {string} [reason] - A textual description of the reason to disconnect. (Optional)
     */
    disconnect(callback?: () => void, code?: number, reason?: string): void;
    /**
     * @param {Params} [params] - [DEPRECATED] The params to send when connecting, for example `{user_id: userToken}`
     *
     * Passing params to connect is deprecated; pass them in the Socket constructor instead:
     * `new Socket("/socket", {params: {user_id: userToken}})`.
     */
    connect(params?: Params): void;
    /**
     * Logs the message. Override `this.logger` for specialized logging. noops by default
     * @param {string} kind
     * @param {string} msg
     * @param {Object} data
     */
    log(kind: string, msg: string, data: Object): void;
    /**
     * Returns true if a logger has been set on this socket.
     */
    hasLogger(): boolean;
    /**
     * Registers callbacks for connection open events
     *
     * @example socket.onOpen(function(){ console.info("the socket was opened") })
     *
     * @param {SocketOnOpen} callback
     */
    onOpen(callback: SocketOnOpen): string;
    /**
     * Registers callbacks for connection close events
     * @param {SocketOnClose} callback
     * @returns {string}
     */
    onClose(callback: SocketOnClose): string;
    /**
     * Registers callbacks for connection error events
     *
     * @example socket.onError(function(error){ alert("An error occurred") })
     *
     * @param {SocketOnError} callback
     * @returns {string}
     */
    onError(callback: SocketOnError): string;
    /**
     * Registers callbacks for connection message events
     * @param {SocketOnMessage} callback
     * @returns {string}
     */
    onMessage(callback: SocketOnMessage): string;
    /**
     * Sets a callback that receives lifecycle events for internal heartbeat messages.
     * Useful for instrumenting connection health (e.g. sent/ok/timeout/disconnected).
     * @param {HeartbeatCallback} callback
     */
    onHeartbeat(callback: HeartbeatCallback): void;
    /**
     * Pings the server and invokes the callback with the RTT in milliseconds
     * @param {(timeDelta: number) => void} callback
     *
     * Returns true if the ping was pushed or false if unable to be pushed.
     */
    ping(callback: (timeDelta: number) => void): boolean;
    /**
     * @private
     *
     * @param {Function}
     */
    private transportName;
    /**
     * @private
     */
    private transportConnect;
    getSession(key: any): string | null;
    storeSession(key: any, val: any): void;
    connectWithFallback(fallbackTransport: any, fallbackThreshold?: number): void;
    clearHeartbeats(): void;
    onConnOpen(): void;
    /**
     * @private
     */
    private heartbeatTimeout;
    resetHeartbeat(): void;
    teardown(callback: any, code: any, reason: any): any;
    waitForBufferDone(conn: any, callback: any, tries?: number): void;
    waitForSocketClosed(conn: any, callback: any, tries?: number): void;
    /**
    * @param {CloseEvent} event
    */
    onConnClose(event: CloseEvent): void;
    /**
     * @private
     * @param {Event} error
     */
    private onConnError;
    /**
     * @private
     * @param {unknown} [reason] underlying close/error event forwarded to channel error listeners
     */
    private triggerChanError;
    /**
     * @returns {string}
     */
    connectionState(): string;
    /**
     * @returns {boolean}
     */
    isConnected(): boolean;
    /**
     *
     * @param {Channel} channel
     */
    remove(channel: Channel): void;
    /**
     * Removes `onOpen`, `onClose`, `onError,` and `onMessage` registrations.
     *
     * @param {string[]} refs - list of refs returned by calls to
     *                 `onOpen`, `onClose`, `onError,` and `onMessage`
     */
    off(refs: string[]): void;
    /**
     * Initiates a new channel for the given topic
     *
     * @param {string} topic
     * @param {Params | (() => Params)} [chanParams]- Parameters for the channel
     * @returns {Channel}
     */
    channel(topic: string, chanParams?: Params | (() => Params)): Channel;
    /**
     * @param {Message<Record<string, any>>} data
     */
    push(data: Message<Record<string, any>>): void;
    /**
     * Return the next message ref, accounting for overflows
     * @returns {string}
     */
    makeRef(): string;
    sendHeartbeat(): void;
    flushSendBuffer(): void;
    /**
    * @param {MessageEvent<any>} rawMessage
    */
    onConnMessage(rawMessage: MessageEvent<any>): void;
    /**
     * @private
     * @template {keyof SocketStateChangeCallbacks} K
     * @param {K} event
     * @param {...Parameters<SocketStateChangeCallbacks[K][number][1]>} args
     * @returns {void}
     */
    private triggerStateCallbacks;
    leaveOpenTopic(topic: any): void;
}
import type { SocketStateChangeCallbacks } from "./types.d.ts";
import Channel from "./channel.d.ts";
import type { SocketTransport } from "./types.d.ts";
import type { Encode } from "./types.d.ts";
import type { Decode } from "./types.d.ts";
import type { HeartbeatCallback } from "./types.d.ts";
import type { Params } from "./types.d.ts";
import type { Vsn } from "./types.d.ts";
import Timer from "./timer.d.ts";
import LongPoll from "./longpoll.d.ts";
import type { SocketOnOpen } from "./types.d.ts";
import type { SocketOnClose } from "./types.d.ts";
import type { SocketOnError } from "./types.d.ts";
import type { SocketOnMessage } from "./types.d.ts";
import type { Message } from "./types.d.ts";
import type { SocketOptions } from "./types.d.ts";
//# sourceMappingURL=socket.d.ts.map
