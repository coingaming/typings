declare var Package: any;
declare var app: string;
declare module Meteor {

	export var connection: DDP.Connection;

	function nextTick(callback: Function);

	function wrapAsync(func: Function): any;
	
	export var server: DDP.Server;

	export var default_connection: any;

	export interface Method {

		/**
		 * The id of the user that made this method call, or null if no user was logged in.
		 */
		userId: string;

		/**
		 * Set the logged in user.
		 *
		 * Call this function to change the currently logged in user on the connection that made this method call.
		 * This simply sets the value of userId for future method calls received on this connection.
		 * Pass null to log out the connection.
		 *
		 * @param userId The value that should be returned by userId on this connection.
		 */
		setUserId(userId: string): void;

		/**
		 * Access inside a method invocation. Boolean value, true if this invocation is a stub.
		 */
		isSimulation: boolean;

		/**
		 * Call inside a method invocation. Allow subsequent method from this client to begin running in a new fiber.
		 */
		unblock()
	}

	export interface ExternalServiceLoginOptions {
		
		/**
		 * A list of permissions to request from the user.
		 */
		requestPermissions: string[];
		
		/**
		 * If true, asks the user for permission to act on their behalf when offline.
		 * This stores an additional offline token in the services field of the user
		 * document. Currently only supported with Google.
		 */
		requestTokenOffline: boolean;

	}

	interface UpdateOptions {
		
		/**
		 * True to modify all matching documents; false to only modify
		 * one of the matching documents (the default).
		 */
		multi?: boolean;

		/**
		 * True to insert a document if no matching documents are found.
		 */
		upsert?: boolean;
	}

	export interface AccessOptions {

		/**
		 * Function that look at a proposed modification to the database and return true if it should be allowed.
		 *
		 * @param userId The user who wants to insert the document
		 * @param doc The document that the user wants to insert
		 */
		insert?: (userId: string, doc: Object) => boolean;

		/**
		 * Function that look at a proposed modification to the database and return true if it should be allowed.
		 *
		 * @param userId The user who wants to update the document
		 * @param doc Current version of the document from the database, without the proposed update.
		 * @param fieldNames Array of the (top-level) fields in doc that the
		 *                   client wants to modify, for example ['name', 'score'].
		 * @param modifier The raw Mongo modifier that the client wants to execute,
		 *                 for example {$set: {'name.first': "Alice"}, $inc: {score: 1}}.
		 *                 Only Mongo modifiers are supported (operations like $set and $push).
		 *                 If the user tries to replace the entire document rather than
		 *                 use $-modifiers, the request will be denied without checking the allow functions.
		 */
		update?: (userId: string, doc: Object, fieldNames: string[], modifier: any) => boolean;

		/**
		 * Function that look at a proposed modification to the database and return true if it should be allowed.
		 *
		 * @param userId The user who wants to remove the document
		 * @param doc The document that the user wants to remove
		 */
		remove?: (userId: string, doc: Object) => boolean;

		/**
		 * Optional performance enhancement. Limits the fields that will be fetched from
		 * the database for inspection by your update and remove functions.
		 */
		fetch?: string[];

		/**
		 * Overrides transform on the Collection. Pass null to disable transformation.
		 *
		 * @param doc 
		 */
		transform?: (doc: Object) => Object;

		download?: Function;
	}

	/**
	 * Meteor collection find and findOne options
	 */
	export interface FindOptions {

		/**
		 * Sort order (default: natural order)
		 */
		sort?: any;

		/**
		 * Number of results to skip at the beginning
		 */
		skip?: number;

		/**
		 * Number of results to skip at the beginning
		 */
		limit?: number;

		/**
		 * (Server only) Dictionary of fields to return or exclude.
		 */
		fields?: any;

		/**
		 * (Client only) Default true; pass false to disable reactivity
		 */
		reacting?: boolean;

		/**
		 * Overrides transform on the  Collection for this cursor. Pass null to disable transformation.
		 */
		transform?: (doc: any) => any;

		cacheTime?: number;

	}

	export interface LiveQueryHandle {
		stop();
	}

	export interface ObserveCallbacks {

		/**
		 * A new document document entered the result set.
		 */
		added? (document): void;

		/**
		 * A new document document entered the result set.
		 * The new document appears at position atIndex.
		 * It is immediately before the document whose _id is before.
		 * Before will be null if the new document is at the end of the results.
		 */
		addedAt? (document, atIndex: number, before: string): void;

		/**
		 * The contents of a document were previously oldDocument and are now newDocument.
		 */
		changed? (newDocument, oldDocument): void;

		/**
		 * The contents of a document were previously oldDocument and are now newDocument.
		 * The position of the changed document is atIndex.
		 */
		changedAt? (newDocument, oldDocument, atIndex: number): void;

		/**
		 * The document oldDocument is no longer in the result set.
		 */
		removed? (oldDocument: any): void;

		/**
		 * The document oldDocument is no longer in the result set.
		 * It used to be at position atIndex.
		 */
		removedAt? (oldDocument, atIndex: number): void;

		/**
		 * A document changed its position in the result set, from fromIndex to toIndex
		 * (which is before the document with id before). Its current contents is document.
		 */
		movedTo? (document, fromIndex: number, toIndex: number, before: string): void;

	}

	export interface ObserveChangesCallbacks {

		/**
		 * A new document entered the result set. It has the id and fields specified.
		 * fields contains all fields of the document excluding the _id field.
		 */
		added? (id: string, fields: any): void;

		/**
		 * A new document entered the result set. It has the id and fields specified.
		 * fields contains all fields of the document excluding the _id field.
		 * The new document is before the document identified by before, or
		 * at the end if before is null.
		 */
		addedBefore? (document, atIndex: number, before: string): void;

		/**
		 * The document identified by id has changed. fields contains the changed fields
		 * with their new values. If a field was removed from the document then it will
		 * be present in fields with a value of undefined.
		 */
		changed? (id: string, fields: any): void;

		/**
		 * The document identified by id changed its position in the ordered result set,
		 * and now appears before the document identified by before.
		 */
		movedBefore? (id: string, before: string): void;

		/**
		 * The document identified by id was removed from the result set.
		 */
		removed? (id: string): void;

	}

	/**
	 * To create a cursor, use find. To access the documents in a cursor, use forEach, map, or fetch.
	 */
	export interface CollectionCursor {

		/**
		 * Call callback once for each matching document, sequentially and synchronously.
		 */
		forEach(callback: (item: any) => void ): void;

		/**
		 * Map callback over all matching documents. Returns an Array.
		 */
		map(callback: (item: any) => void ): void;

		/**
		 * Return all matching documents as an Array.
		 */
		fetch(): Object[];

		/**
		 * Returns the number of documents that match a query.
		 */
		count(): number;

		/**
		 * Resets the query cursor.
		 */
		rewind(): void;

		/**
		 * Watch a query. Receive callbacks as the result set changes.
		 * @see http://docs.meteor.com/#foreach
		 */
		observe(callbacks: ObserveCallbacks): LiveQueryHandle;

		/**
		 * Watch a query. Receive callbacks as the result set changes. Only the differences
		 * between the old and new documents are passed to the callbacks.
		 */
		observeChanges(callbacks: ObserveChangesCallbacks): LiveQueryHandle;

	}

	/**
	 * This class represents a symbolic error thrown by a method.
	 *
	 * If you want to return an error from a method, throw an exception.
	 * Methods can throw any kind of exception. But Meteor.Error is the only
	 * kind of error that a server will send to the client. If a method function
	 * throws a different exception, then it will be mapped to a sanitized version
	 * on the wire. Specifically, if the sanitizedError field on the thrown error
	 * is set to a Meteor.Error, then that error will be sent to the client.
	 * Otherwise, if no sanitized version is available, the client gets
	 * Meteor.Error(500, 'Internal server error').
	 */
	export class Error {

		public error: number;
		public reason: string;
		public details: string;
		public errorType: string;

		/**
		 * @param error A numeric error code, likely similar to an HTTP code (eg, 404, 500).
		 * @param reason A short human-readable summary of the error, like 'Not Found'.
		 * @param details Additional information about the error, like a textual stack trace.
		 */
		constructor(error: number, reason?: string, details?: string);

	}

	/**
	 * Publish a record set.
	 *
	 * @param name Name of the attribute set. If null, the set has no name, and
	 *             the record set is automatically sent to all connected clients.
	 * @param func Function called on the server each time a client subscribes.
	 *             Inside the function, this is the publish handler object,
	 *             described below. If the client passed arguments to subscribe,
	 *             the function is called with the same arguments.
	 */
	export function publish(name: string, func: Function): void;

	export interface PublishContext {
		userId: string;
		added(collection: string, id: string, fields: any);
		changed(collection: string, id: string, fields: any);
		removed(collection: string, id: string);
		ready();
		onStop(func: Function);
		error(error);
		stop();
		_callStopCallbacks();
		connection: DDP.Connection;
	}

	/**
	 * Subscribe to a record set. Returns a handle that provides stop() and ready() methods.
	 *
	 * @param name Name of the subscription. Matches name of server's publish() call.
	 * @param arg1 Optional arguments passed to publisher function on server.
	 * @param arg2 Optional arguments passed to publisher function on server.
	 * @param arg3 Optional arguments passed to publisher function on server.
	 * @param callbacks Optional. May include onError and onReady callbacks.
	 *                  If a function is passed instead of an object,
	 *                  it is interpreted as an onReady callback.
	 */
	export function subscribe(name: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, callbacks?: any): DDP.Subscription;

	/**
	 * Defines functions that can be invoked over the network by clients.
	 *
	 * @pardam methods Dictionary whose keys are method names and values are functions.
	 */
	export function methods(methods: {
		[methodName: string]: Function;
	});

	/**
	 * Dictionary whose keys are method names and values are functions.
	 *
	 * @param name Name of method to invoke
	 * @param param1 Optional method arguments
	 * @param param2 Optional method arguments
	 * @param param3 Optional method arguments
	 * @param asyncCallback Optional callback, which is called asynchronously with the error
	 *                      or result after the method is complete. If not provided,
	 *                      the method runs synchronously if possible (see below).
	 */
	export function call(name: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, asyncCallback?: Function): any;

	/**
	 * Invoke a method passing an array of arguments.
	 *
	 * @param name Name of method to invoke
	 * @param args Method arguments
	 * @param options
	 * @param callback Optional callback; same semantics as in Meteor.call.
	 */
	export function apply(name: string, args?: any[], options?: {

		/**
		 * (Client only) If true, don't send this method until all previous
		 * method calls have completed, and don't send any subsequent method
		 * calls until this one is completed.
		 */
		wait?: boolean;

		/**
			* (Client only) This callback is invoked with the error or result of
			* the method (just like asyncCallback) as soon as the error or result
			* is available. The local cache may not yet reflect the writes
			* performed by the method.
			*/
		onResultReceived?: () => any;

	}, asyncCallback?: (err, result) => void ): any;

	/**
	 * Get the current connection status. A reactive data source.
	 */
	export function status(): {

		/**
		 * True if currently connected to the server. If false, changes and method
		 * invocations will be queued up until the connection is reestablished.
		 */
		connected: boolean;

		/**
		 * Describes the current reconnection status. The possible values are connected
		 * (the connection is up and running), connecting (disconnected and trying to
		 * open a new connection), failed (permanently failed to connect; e.g., the
		 * client and server support different versions of DDP) and waiting (failed to
		 * connect and waiting to try to reconnect).
		 */
		status: string;

		/**
		 * The number of times the client has tried to reconnect since the
		 * connection was lost. 0 when connected.
		 */
		retryCount: number;

		/**
		* The estimated time of the next reconnection attempt. To turn this into an
		* interval until the next reconnection, use  retryTime - (new Date()).getTime().
		* This key will be set only when status is waiting.
		*/
		retryTime?: number;

		/**
		 * If status is failed, a description of why the connection failed.
		 */
		reason?: string;

	};

	/**
	 * Force an immediate reconnection attempt if the client is not connected to the server.
	 * This method does nothing if the client is already connected.
	 */
	export function reconnect(): void;

	/**
	 * True if running in client environment.
	 */
	export var isClient: boolean;

	/**
	 * True if running in server environment.
	 */
	export var isServer: boolean;

	/**
	 * Run code when a client or a server starts.
	 *
	 * @param func A function to run on startup.
	 */
	export function startup(func: () => void ): void;

	/**
	 * Generate an absolute URL pointing to the application.
	 * The server reads from the ROOT_URL environment variable
	 * to determine where it is running. This is taken care of
	 * automatically for apps deployed with meteor deploy, but
	 * must be provided when using meteor bundle.
	 * 
	 * @param path A path to append to the root URL. Do not include a leading "/".
	 * @param options
	 */
	export function absoluteUrl(path?: string, options?: {

		/**
		 * Create an HTTPS URL.
		 */
		secure?: boolean;

		/**
		 * Replace localhost with 127.0.0.1. Useful for services that
		 * don't recognize localhost as a domain name.
		 */
		replaceLocalhost?: boolean;

		/**
		 * Override the default ROOT_URL from the server environment.
		 * For example: "http://foo.example.com"
		 */
		rootUrl?: string;

	}): string;

	/**
	 * Meteor.settings contains any deployment-specific options that were
	 * provided using the --settings option for meteor run or meteor deploy.
	 * If you provide the --settings option, Meteor.settings will be the
	 * JSON object in the file you specify. Otherwise, Meteor.settings will
	 * be an empty object. If the object contains a key named public, then
	 * Meteor.settings.public will also be available on the client.
	 */
	export var settings: any;

	/**
	 * Meteor.release is a string containing the name of the release with
	 * which the project was built (for example, "0.6.4"). It is undefined
	 * if the project was built using a git checkout of Meteor.
	 */
	export var release: string;

	/**
	 * Get the current user record, or null if no user is logged in. A reactive data source.
	 *
	 * Retrieves the user record for the current user from the Meteor.users collection.
	 *
	 * On the client, this will be the subset of the fields in the document that are
	 * published from the server (other fields won't be available on the client).
	 * By default the server publishes username, emails, and profile. See Meteor.users
	 * for more on the fields used in user documents.
	 */
	export function user(): MeteorUser;

	/**
	 * Get the current user id, or null if no user is logged in. A reactive data source.
	 */
	export function userId(): string;

	/**
	 * A Meteor.Collection containing user documents.
	 */
	export var users: Collection;

	/**
	 * True if a login method (such as Meteor.loginWithPassword, Meteor.loginWithFacebook,
	 * or Accounts.createUser) is currently in progress. A reactive data source.
	 *
	 * For example, the accounts-ui package uses this to display an animation while
	 * the login request is being processed.
	 */
	export function loggingIn(): boolean;

	/**
	 * Log the user out.
	 *
	 * @param callback Optional callback. Called with no arguments on success,
	 *                 or with a single Error argument on failure.
	 */
	export function logout(callback?: () => void ): void;

	/**
	 * Log the user in with a password.
	 *
	 * @param user Either a string interpreted as a username or an email;
	 *             or an object with a single key: email, username or id.
	 * @param password Either a string interpreted as a username or an email;
	 *                 or an object with a single key: email, username or id.
	 * @param callback Optional callback. Called with no arguments on success,
	 *                 or with a single Error argument on failure.
	 */
	export function loginWithPassword(user: any, password: string, callback: (error?: any) => void ): void;

	/**
	 * Log the user in with a token.
	 *
	 * @param user Login tokebn
	 * @param callback Optional callback. Called with no arguments on success,
	 *                 or with a single Error argument on failure.
	 */
	export function loginWithToken(token: string, callback: (error?: any) => void ): void;

	/**
	 * Log the user in using an Facebook.
	 *
	 * @param options Optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 * @param callback 
	 */
	export function loginWithFacebook(options?: ExternalServiceLoginOptions, callback?: (error?: any) => void ): void;

	/**
	 * Log the user in using an Github.
	 *
	 * @param options Optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 * @param callback 
	 */
	export function loginWithGithub(options?: ExternalServiceLoginOptions, callback?: (error?: any) => void ): void;

	/**
	 * Log the user in using an Google.
	 *
	 * @param options Optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 * @param callback 
	 */
	export function loginWithGoogle(options?: ExternalServiceLoginOptions, callback?: (error?: any) => void ): void;

	/**
	 * Log the user in using an Meetup.
	 *
	 * @param options Optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 * @param callback 
	 */
	export function loginWithMeetup(options?: ExternalServiceLoginOptions, callback?: (error?: any) => void ): void;

	/**
	 * Log the user in using an Twitter.
	 *
	 * @param options Optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 * @param callback 
	 */
	export function loginWithTwitter(options?: ExternalServiceLoginOptions, callback?: (error?: any) => void ): void;

	/**
	 * Log the user in using an Weibo.
	 *
	 * @param options Optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 * @param callback 
	 */
	export function loginWithWeibo(options?: ExternalServiceLoginOptions, callback?: (error?: any) => void ): void;

	/**
	 * Call a function in the future after waiting for a specified delay.
	 *
	 * Returns a handle that can be used by Meteor.clearTimeout.
	 *
	 * @param func The function to run
	 * @param delay Number of milliseconds to wait before calling function
	 */
	export function setTimeout(func: () => void , delay: number): number;

	/**
	 * Call a function repeatedly, with a time delay between calls.
	 *
	 * Returns a handle that can be used by Meteor.clearInterval.
	 *
	 * @param func The function to run
	 * @param delay Number of milliseconds to wait between each function call.
	 */
	export function setInterval(func: () => void , delay: number): number;

	/**
	 * Cancel a function call scheduled by Meteor.setTimeout.
	 *
	 * @param id The handle returned by Meteor.setTimeout
	 */
	export function clearTimeout(id: number): void;

	/**
	 * Cancel a repeating function call scheduled by Meteor.setInterval.
	 *
	 * @param id The handle returned by Meteor.setInterval
	 */
	export function clearInterval(id: number): void;

	export function bindEnvironment(callback: Function, onException: (e) => void): Function;

	export interface CollectionOptions {
		connection?: DDP.Connection;
		idGeneration?: string;
		transform?: (doc: any) => any;
	}

	export class SmartCollection extends Collection {

	}

	/**
	 * 
	 */
	export class Collection {

		constructor(name: string, options?: CollectionOptions);

		/**
		 * Find the documents in a collection that match the selector.
		 *
		 * @param selector The query
		 * @param options 
		 */
		find(seletor?: string, options?: FindOptions): CollectionCursor;

		/**
		 * Find the documents in a collection that match the selector.
		 *
		 * @param selector The query
		 * @param options 
		 */
		find(seletor?: any, options?: FindOptions): CollectionCursor;

		/**
		 * Finds the first document that matches the selector, as ordered by sort and skip options.
		 *
		 * @param selector The query
		 * @param options 
		 */
		findOne(seletor?: string, options?: FindOptions): any;

		/**
		 * Finds the first document that matches the selector, as ordered by sort and skip options.
		 *
		 * @param selector The query
		 * @param options 
		 */
		findOne(seletor?: any, options?: FindOptions): any;

		/**
		 * Insert a document in the collection. Returns its unique _id.
		 *
		 * @param doc The document to insert. May not yet have an _id attribute,
		 *            in which case Meteor will generate one for you.
		 * @param callback Optional. If present, called with an error object as the
		 *                 first argument and, if no error, the _id as the second.
		 */
		insert(doc: Object, callback?: (error?: any, _id?: string) => string);

		/**
		 * Optional. If present, called with an error object as the first
		 * argument and, if no error, the _id as the second.
		 *
		 * @param selector Modify one or more documents in the collection
		 * @param modifier Specifies which documents to modify
		 * @param options
		 * @param callback True to modify all matching documents; false to only modify one of the matching documents (the default).
		 */
		update(selector: string, modifier: Object, options?: UpdateOptions, callback?: (error?: any) => void );

		/**
		 * Optional. If present, called with an error object as the first
		 * argument and, if no error, the _id as the second.
		 *
		 * @param selector Modify one or more documents in the collection
		 * @param modifier Specifies which documents to modify
		 * @param options
		 * @param callback True to modify all matching documents; false to only modify one of the matching documents (the default).
		 */
		update(selector: Object, modifier: Object, options?: UpdateOptions, callback?: (error?: any) => void );

		/**
		 * Remove documents from the collection
		 *
		 * @param selector Specifies which documents to remove
		 * @param callback Optional. If present, called with an error object as its argument.
		 */
		remove(selector: string, callback?: (error?: any) => void );

		/**
		 * Remove documents from the collection
		 *
		 * @param selector Specifies which documents to remove
		 * @param callback Optional. If present, called with an error object as its argument.
		 */
		remove(selector: Object, callback?: (error?: any) => void );

		/**
		 * Allow users to write directly to this collection from client code, subject to limitations you define.
		 *
		 * @param options 
		 */
		allow(options: AccessOptions);

		/**
		 * Override allow rules.
		 *
		 * This works just like allow, except it lets you make sure that
		 * certain writes are definitely denied, even if there is an allow
		 * rule that says that they should be permitted.
		 *
		 * When a client tries to write to a collection, the Meteor server
		 * first checks the collection's deny rules. If none of them return
		 * true then it checks the collection's allow rules. Meteor allows
		 * the write only if no deny rules return true and at least one allow
		 * rule returns true.
		 *
		 * @param options 
		 */
		deny(options: AccessOptions);

		_makeNewID(): string;

		attachSchema(schema: SimpleSchema);
		simpleSchema(): SimpleSchema;

	}

	export var _htmlFilters: Function[];
	
	export function publishWithRelations(options);

}

interface SimpleSchemaEntry {
	type: any;
	label?: string;
	max?: number;
	min?: number;
	optional?: boolean;
	defaultValue?: any;
	autoform?: {
		type?: string;
		rows?: number;
		'label-type'?: string;
		options?: {value: any, label: string}[];
	};
}

declare class SimpleSchema {
	constructor(schema: {[field: string]: SimpleSchemaEntry});
}


/**
 * Meteor.http provides an HTTP API on the client and server. To use these
 * functions, add the HTTP package to your project with $ meteor add http.
 */
declare module HTTP {

    export interface Options {

        /**
         * String to use as the HTTP request body.
         */
        content?: string;

        /**
         * JSON-able object to stringify and use as the HTTP request body.Overwrites content.
         */
        data?: any;

        /**
         * Query string to go in the URL.Overwrites any query string in url.
         */
        query?: string;

        /**
         * Dictionary of request parameters to be encoded and placed in the URL (for GETs) or request
         * body (for POSTs). If content or data is specified, params will always be placed in the URL.
         */
        params?: any;

        /**
         * HTTP basic authentication string of the form "username:password"
         */
        auth?: string;

        /**
         * Dictionary of strings, headers to add to the HTTP request.
         */
        headers?: any;

        /**
         * Maximum time in milliseconds to wait for the request before failing.There is no timeout by default.
         */
        timeout?: number;

        /**
         * If true, transparently follow HTTP redirects.Cannot be set to false on the client.
         */
        followRedirects?: boolean;

    }

    export interface Result {

        /**
         * Numeric HTTP result status code, or null on error.
         */
        statusCode: number;

        /**
         * The body of the HTTP response as a string.
         */
        content: string;

        /**
         * If the response headers indicate JSON content, this contains
         * the body of the document parsed as a JSON object.
         */
        data?: any;

        /**
         * A dictionary of HTTP headers from the response.
         */
        headers: any;

    }

    /**
     * Perform an outbound HTTP request.
     *
     * @param method The HTTP method to use: "GET", "POST", "PUT", or "DELETE".
     * @param url The URL to retrieve.
     * @param options
     * @param asyncCallback Optional callback. If passed, the method runs asynchronously, instead of
     *                      synchronously, and calls asyncCallback. On the client, this callback is required.
     */
    export function call(method: string, url: string, options?: Options, asyncCallback?): Result;

    /**
     * Send an HTTP GET request. Equivalent to Meteor.http.call("GET", ...).
     *
     * @param url The URL to retrieve.
     * @param options
     * @param asyncCallback Optional callback. If passed, the method runs asynchronously, instead of
     *                      synchronously, and calls asyncCallback. On the client, this callback is required.
     */
    export function get(url: string, options?: Options, asyncCallback?): Result;

    /**
     * Send an HTTP POST request. Equivalent to Meteor.http.call("POST", ...).
     *
     * @param url The URL to retrieve.
     * @param options
     * @param asyncCallback Optional callback. If passed, the method runs asynchronously, instead of
     *                      synchronously, and calls asyncCallback. On the client, this callback is required.
     */
    export function post(url: string, options?: Options, asyncCallback?): Result;

    /**
     * Send an HTTP PUT request. Equivalent to Meteor.http.call("PUT", ...).
     *
     * @param url The URL to retrieve.
     * @param options
     * @param asyncCallback Optional callback. If passed, the method runs asynchronously, instead of
     *                      synchronously, and calls asyncCallback. On the client, this callback is required.
     */
    export function put(url: string, options?: Options, asyncCallback?): Result;

    /**
     * Send an HTTP DELETE request. Equivalent to Meteor.http.call("DELETE", ...).
     *
     * @param url The URL to retrieve.
     * @param options
     * @param asyncCallback Optional callback. If passed, the method runs asynchronously, instead of
     *                      synchronously, and calls asyncCallback. On the client, this callback is required.
     */
    export function del(url: string, options?: Options, asyncCallback?): Result;
}

/**
 * Session provides a global object on the client that you
 * can use to store an arbitrary set of key-value pairs.
 * Use it to store things like the currently selected item in a list.
 * 
 * What's special about Session is that it's reactive.
 * If you call Session.get("currentList") from inside a template,
 * the template will automatically be rerendered whenever
 * Session.set("currentList", x) is called.
 */
interface Session {

	/**
	 * Set a variable in the session. Notify any listeners that the
	 * value has changed (eg: redraw templates, and rerun any Deps.autorun
	 * computations, that called Session.get on this key.)
	 *
	 * @param key The key to set, eg, selectedItem
	 * @param value The new value for key
	 */
	set(key: string, value?: any);

	/**
	 * Set a variable in the session if it is undefined. Otherwise works exactly the same as Session.set.
	 *
	 * This is useful in initialization code, to avoid re-initializing a
	 * session variable every time a new version of your app is loaded.
	 *
	 * @param key The key to set, eg, selectedItem
	 * @param value The new value for key
	 */
	setDefault(key: string, value?: any);

	/**
	 * Get the value of a session variable. If inside a reactive computation, invalidate
	 * the computation the next time the value of the variable is changed by Session.set.
	 * This returns a clone of the session value, so if it's an object or an array,
	 * mutating the returned value has no effect on the value stored in the session.
	 *
	 * @param key The name of the session variable to return
	 */
	get(key: string): any;

	/**
	 * Test if a session variable is equal to a value. If inside a reactive computation,
	 * invalidate the computation the next time the variable changes to or from the value.
	 *
	 * @param key The name of the session variable to test
	 * @param value The value to test against
	 */
	equals(key: string, value: any);

}

declare var Session: Session;

interface MeteorTemplate {
	data: any;
	$: JQueryStatic;
	find(selector: string): HTMLElement;
	findAll(selector: string): HTMLElement;
	firstNode: HTMLElement;
	lastNode: HTMLElement;
	subscribe(name: string, arg1?: any, arg2?: any, arg3?: any, callbacks?: any): DDP.Subscription;
	subscriptionsReady(): boolean;
}

interface MeteorTemplateEvent {

	/**
	 * The event's type, such as "click", "blur" or "keypress".
	 */
	type: string;

	/**
	 * The element that originated the event.
	 */
	target: HTMLElement;

	/**
	 * The element currently handling the event. This is the element that matched the selector in the event map.
	 * For events that bubble, it may be target or an ancestor of target, and its value changes as the event bubbles.
	 */
	currentTarget: HTMLElement;

	/**
	 * For mouse events, the number of the mouse button (1=left, 2=middle, 3=right). For key events, a character or key code.
	 */
	which: number;

	/**
	 * Prevent the event from propagating (bubbling) up to other elements. Other event handlers
	 * matching the same element are still fired, in this and other event maps.
	 */
	stopPropagation(): void;

	/**
	 * Prevent all additional event handlers from being run on this event, including other handlers
	 * in this event map, handlers reached by bubbling, and handlers in other event maps.
	 */
	stopImmidatePropagation(): void;

	/**
	 * Prevents the action the browser would normally take in response to this event, such as following
	 * a link or submitting a form. Further handlers are still called, but cannot reverse the effect.
	 */
	preventDefault(): void;

	/**
	 * Returns whether stopPropagation() has been called for this event.
	 */
	isPropagationStopped(): boolean;

	/**
	 * Returns whether stopImmediatePropagation() has been called for this event.
	 */
	isImmidiatePropagationStopped(): boolean;

	/**
	 * Returns whether stopImmediatePropagation() has been called for this event.
	 */
	isDefaultPrevented(): boolean;

}

interface Template {

	/**
	 * Provide a callback when an instance of a template is rendered.
	 */
	rendered?(): void;

	/**
	 * Provide a callback when an instance of a template is created.
	 */
	created?(): void;

	/**
	 * Provide a callback when an instance of a template is destroyed.
	 */
	destroyed?(): void;

	/**
	 * Specify event handlers for this template.
	 *
	 * @param eventMap Event handlers to associate with this template.
	 */
	events(eventMap: {
		[eventSelector:string]: Function;
	}): void;

	/**
	 * Specify template helpers available to this template.
	 *
	 * Each template has a local dictionary of helpers that are made available to it,
	 * and this call specifies helpers to add to the template's dictionary.
	 *
	 * @param helpers Dictionary of helper functions by name.
	 */
	helpers(helpers: {
		[name: string]: any;
	}): void;

	/**
	 * Specify rules for preserving individual DOM elements on re-render.
	 *
	 * @param selectors Array of CSS selectors that each match at most one element,
	 *                  such as ['.thing1', '.thing2'], or, alternatively, a dictionary
	 *                  of selectors and node-labeling functions (see below).
	 */
	preserve(selectors: any): void;
	
	[varName: string]: any;
	(data?: any): string;

	findAll(selector: string); /** TODO: add return value **/
	$(selector: string); /** TODO: add return value **/
	find(selector?: string); /** TODO: add return value **/
	firstNode; /** TODO: add return value **/
	lastNode; /** TODO: add return value **/
	data; /** TODO: add return value **/
	autorun(runFunc: Function); /** TODO: add return value **/
	view; /** TODO: add return value **/
	registerHelper(name: string, func: Function); /** TODO: add return value **/
	body; /** TODO: add return value **/
	subscribe(name: string, arg1?: any, arg2?: any, arg3?: any, callbacks?: any): DDP.Subscription;
	subscriptionsReady(): boolean;

	onRendered(callback: () => void): void;
	onCreated(callback: () => void): void;
	onDestroyed(callback: () => void): void;
	setVar(name: string, value: any);
	getVar(name: string): any;
}

interface Templates {
	instance(): Template;
	currentData(): any;
	parentData(numLevels: number): any;
}

declare var Template: Templates;

interface MeteorUser {

	_id: string;

	/**
	 * a unique String identifying the user.
	 */
	username: string;

	/**
	 * an Array of Objects with keys address and verified; an email address
	 * may belong to at most one user. verified is a Boolean which is true if
	 * the user has verified the address with a token sent over email.
	 */
	emails: {

		/**
		 * Email address may belong to at most one user.
		 */
		address: string;

		/**
		 * True if the user has verified the address with a token sent over email.
		 */
		verified: boolean;

	}[];

	/**
	 * A numeric timestamp (milliseconds since January 1 1970) of the time the user document was created.
	 */
	createdAt: number;
	
	/**
	 * An Object which (by default) the user can create and update with any data.
	 */
	profile: any;

	/**
	 * An Object containing data used by particular login services. For example, its reset field contains tokens used by forgot password links, and its resume field contains tokens used to keep you logged in between sessions.
	 */
	services: {

		/**
		 * Contains tokens used by forgot password links
		 */
		reset?: any;

		/**
		 * Contains tokens used to keep you logged in between sessions.
		 */
		resume?: any;

		password?: any;

	};
}

declare module Accounts {

	export function _checkPassword(user: MeteorUser, password: {}): boolean;

	export function _insertLoginToken(userId: string, token: {}): void;

	export function _hashLoginToken(token: string): string;

	export function _hashStampedToken(token: {}): {};

	export function callLoginMethod(options: any): void;

	export interface UserOptions {

		/**
		 * A unique name for this user.
		 */
		username: string;

		/**
		 * The user's email address.
		 */
		email?: string;

		/**
		 * The user's password. This is not sent in plain text over the wire.
		 */
		password?: string;

		/**
		 * The user's profile, typically including the name field.
		 */
		profile?: any;

		site?: string;

	}

	/**
	 * Set global accounts options.
	 */
	export function config(options: {
		
		/**
		 * New users with an email address will receive an address verification email.
		 */
		sendVerificationEmail: boolean;

		/**
		 * Calls to createUser from the client will be rejected. In addition, if you
		 * are using accounts-ui, the "Create account" link will not be available.
		 */
		forbidClientAccountCreation: boolean;

	});

	export module ui {

		/**
		 * Configure the behavior of {{loginButtons}}.
		 */
		export function config(options: {

			/**
			 * Which permissions to request from the user for each external service.
			 */
			requestPermissions?: {
				google?: string[];
				facebook?: string[];
				github?: string[];
				meetup?: string[];
				twitter?: string[];
				weibo?: string[];
			};

			/**
			 * To ask the user for permission to act on their behalf when offline, map the
			 * relevant external service to true. Currently only supported with Google.
			 * See Meteor.loginWithExternalService for more details.
			 */
			requestOfflineToken?: {
				google?: boolean;
				facebook?: boolean;
				github?: boolean;
				meetup?: boolean;
				twitter?: boolean;
				weibo?: boolean;
			};

			/**
			 * Which fields to display in the user creation form. One of:
			 * 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
			 */
			passwordSignupFields?: string;

		});
	}

	/**
	 * Set restrictions on new user creation.
	 *
	 * @param func Called whenever a new user is created. Takes the new user object,
	 *             and returns true to allow the creation or false to abort.
	 */
	export function validateNewUser(func: (user: any) => boolean): void;

	/**
	 * Set restrictions on user login.
	 *
	 * @param func Called whenever a login is attempted. Takes the new user object,
	 *             and returns true to allow the creation or false to abort.
	 */
	export function validateLoginAttempt(func: (attempt: any) => void): void;

	/**
	 *
	 * @param func Register a callback to be called after a login attempt succeeds.
	 */
	export function onLogin(func: Function): {stop: Function};

	/**
	 *
	 * @param func Register a callback to be called after a login attempt fails.
	 */
	export function onLoginFailure(func: Function): {stop: Function};

	/**
	 * Customize new user creation.
	 *
	 * @param func Called whenever a new user is created. Return the new user object, or throw an Error to abort the creation.
	 */
	export function onCreateUser(func: (options: any, user: MeteorUser) => MeteorUser);

	/**
	 * Create a new user.
	 * 
	 * On the client, this function logs in as the newly created user on successful completion.
	 * On the server, it returns the newly created user id.
	 * 
	 * On the client, you must pass password and one of username or email — enough information
	 * for the user to be able to log in again later. On the server, you can pass any subset
	 * of these options, but the user will not be able to log in until it has an identifier and a password.
	 * 
	 * To create an account without a password on the server and still let the user pick their
	 * own password, call createUser with the email option and then call Accounts.sendEnrollmentEmail.
	 * This will send the user an email with a link to set their initial password.
	 * 
	 * By default the profile option is added directly to the new user document.
	 * To override this behavior, use Accounts.onCreateUser.
	 * 
	 * This function is only used for creating users with passwords.
	 * The external service login flows do not use this function.
	 *
	 * @param options 
	 * @param callback Client only, optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 */
	export function createUser(options: UserOptions, callback?: (error?) => void ): string;

	/**
	 * Change the current user's password. Must be logged in.
	 *
	 * @param oldPassword The user's current password. This is not sent in plain text over the wire.
	 * @param newPassword A new password for the user. This is not sent in plain text over the wire.
	 * @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 */
	export function changePassword(oldPassword: string, newPassword: string, callback?: (error?) => void ): void;

	/**
	 * Request a forgot password email.
	 *
	 * This triggers a call to Accounts.sendResetPasswordEmail on the server.
	 * Pass the token the user receives in this email to Accounts.resetPassword to complete the password reset process.
	 *
	 * If you are using the accounts-ui package, this is handled automatically.
	 * Otherwise, it is your responsiblity to prompt the user for the new password and call resetPassword.
	 *
	 * @param options 
	 * @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 */
	export function forgotPassword(options: {

		/**
		 * The email address to send a password reset link.
		 */
		email: string;

	}, callback: (error?) => void );

	/**
	 * Reset the password for a user using a token received in email. Logs the user in afterwards.
	 *
	 * This function accepts tokens generated by Accounts.sendResetPasswordEmail and Accounts.sendEnrollmentEmail.
	 *
	 * @param token The token retrieved from the reset password URL.
	 * @param newPassword A new password for the user. This is not sent in plain text over the wire.
	 * @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 */
	export function resetPassword(token: string, newPassword: string, callback?: (error?) => void ): void;

	/**
	 * Forcibly change the password for a user.
	 *
	 * @param userId The id of the user to update.
	 * @param newPassword A new password for the user.
	 */
	export function setPassword(userId: string, newPassword: string): void;

	/**
	 * Marks the user's email address as verified. Logs the user in afterwards.
	 *
	 * This function accepts tokens generated by Accounts.sendVerificationEmail. It sets the emails.verified field in the user record.
	 *
	 * @param token The token retrieved from the verification URL.
	 * @param callback Optional callback. Called with no arguments on success, or with a single Error argument on failure.
	 */
	export function verifyEmail(token: string, callback?: (error?) => void ): void;

	/**
	 * Send an email with a link the user can use to reset their password.
	 *
	 * The token in this email should be passed to Accounts.resetPassword.
	 * To customize the contents of the email, see Accounts.emailTemplates.
	 *
	 * @param userId The id of the user to send email to.
	 * @param email Optional. Which address of the user's to send the email to.
	 *              This address must be in the user's emails list. Defaults to the first email in the list.
	 */
	export function sendResetPasswordEmail(userId: string, email?: string): void;

	/**
	 * Send an email with a link the user can use to set their initial password.
	 *
	 * The token in this email should be passed to Accounts.resetPassword.
	 * To customize the contents of the email, see Accounts.emailTemplates.
	 *
	 * @param userId The id of the user to send email to.
	 * @param email Optional. Which address of the user's to send the email to.
	 *              This address must be in the user's emails list. Defaults to the first email in the list.
	 */
	export function sendEnrollmentEmail(userId: string, email?: string): void;

	/**
	 * Send an email with a link the user can use verify their email address.
	 *
	 * The token in this email should be passed to Accounts.resetPassword.
	 * To customize the contents of the email, see Accounts.emailTemplates.
	 *
	 * @param userId The id of the user to send email to.
	 * @param email Optional. Which address of the user's to send the email to.
	 *              This address must be in the user's emails list. Defaults to the first unverified email in the list.
	 */
	export function sendVerificationEmail(userId: string, email?: string): void;

	export function onEmailVerificationLink(func: (token: any, done: boolean) => void): void;

	/**
	 * Options to customize emails sent from the Accounts system.
	 *
	 * This is an Object with several fields that are used to generate text for the emails
	 * sent by sendResetPasswordEmail, sendEnrollmentEmail, and sendVerificationEmail.
	 */
	export module emailTemplates {
		
		export interface Template {

			/**
			 * Subject line of an email.
			 */
			subject(user: MeteorUser): string;

			/**
			 * Body text for an email
			 */
			text(user: MeteorUser, url: string): string;

		}

		/**
		 * A String with an RFC5322 From address. By default, the email is sent from no-reply@meteor.com.
		 * If you wish to receive email from users asking for help with their account,
		 * be sure to set this to an email address that you can receive email at.
		 */
		export var from: string;

		/**
		 * The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
		 */
		export var siteName: string;

		/**
		 * Template for Reset password
		 */
		export var resetPassword: Template;

		/**
		 * Template for Initial password setup for new accounts
		 */
		export var enrollmentAccount: Template;

		/**
		 * Template for verifying the users email address.
		 */
		export var verifyEmail: Template;

	}

	export function _generateStampedLoginToken();
	export function _tokenExpiration(time);
	export function registerLoginHandler(name, func: (options) => any): void;

}

declare module Tracker {

	/**
	 * Run a function now and rerun it later whenever its dependencies change.
	 * Returns a Computation object that can be used to stop or observe the rerunning.
	 *
	 * @param runFunc The function to run. It receives one argument: the Computation
	 *                object that will be returned.
	 */
	export function autorun(runFunc: (computation?: Tracker.Computation) => Tracker.Computation): void;
	export function autorun(runFunc: () => void): void;

	/**
	 * Process all reactive updates immediately and ensure that all invalidated computations are rerun.
	 */
	export function flush();

	/**
	 * Run a function without tracking dependencies.
	 *
	 * Calls func() with Deps.currentComputation temporarily set to null.
	 * If func accesses reactive data sources, these data sources will never
	 * cause a rerun of the enclosing computation.
	 *
	 * @param func A function to call immediately.
	 */
	export function nonreactive(func: () => void );

	/**
	 * True if there is a current computation, meaning that dependencies on reactive
	 * data sources will be tracked and potentially cause the current computation to be rerun.
	 *
	 * This value is useful for data source implementations to determine whether
	 * they are being accessed reactively or not.
	 */
	export var active: boolean;

	/**
	 * The current computation, or null if there isn't one. The current computation is
	 * the Deps.Computation object created by the innermost active call to Deps.autorun,
	 * and it's the computation that gains dependencies when reactive data sources are accessed.
	 *
	 * It's very rare to need to access currentComputation directly. The current computation
	 * is used implicitly by Deps.active (which tests whether there is one), dependency.depend()
	 * (which registers that it depends on a dependency), and Deps.onInvalidate (which registers
	 * a callback with it).
	 */
	export var currentComputation: Computation;

	/**
	 * Registers a new onInvalidate callback on the current computation (which must exist),
	 * to be called immediately when the current computation is invalidated or stopped.
	 *
	 * @param callback Registers a new onInvalidate callback on the current computation (which must exist),
	 *                 to be called immediately when the current computation is invalidated or stopped.
	 */
	export function onInvalidate(callback: (computation?: Computation) => void ): void;

	/**
	 * Schedules a function to be called during the next flush, or later in the current flush
	 * if one is in progress, after all invalidated computations have been rerun. The function
	 * will be run once and not on subsequent flushes unless afterFlush is called again.
	 *
	 * Functions scheduled by multiple calls to afterFlush are guaranteed to run in the order
	 * that afterFlush was called. Functions are guaranteed to be called at a time when there
	 * are no invalidated computations that need rerunning. This means that if an afterFlush
	 * function invalidates a computation, that computation will be rerun before any other
	 * afterFlush functions are called.
	 *
	 * @param callback A function to call at flush time.
	 */
	export function afterFlush(callback: () => void ): void;

	/**
	 * A Computation object represents code that is repeatedly rerun in response to reactive data changes.
	 * Computations don't have return values; they just perform actions, such as rerendering a template on
	 * the screen. Computations are created using Deps.autorun. Use stop to prevent further rerunning of
	 * a computation.
	 */
	export class Computation {

		/**
		 * Prevents this computation from rerunning.
		 */
		stop(): void;
		
		/**
		 * Invalidates this computation so that it will be rerun.
		 */
		invalidate(): void;

		/**
		 * Registers callback to run when this computation is next invalidated, or runs it immediately
		 * if the computation is already invalidated. The callback is run exactly once and not upon
		 * future invalidations unless onInvalidate is called again after the computation becomes valid again.
		 *
		 * @param callback Function to be called on invalidation. Receives one argument,
		 *                 the computation that was invalidated.
		 */
		onInvalidate(callback: (computation?: Computation) => void ): void;

		/**
		 * True if this computation has been stopped.
		 */
		stopped: boolean;

		/**
		 * True if this computation has been invalidated (and not yet rerun), or if it has been stopped.
		 * 
		 * This property is initially false. It is set to true by stop() and invalidate().
		 * It is reset to false when the computation is recomputed at flush time.
		 */
		invalidated: boolean;

		/**
		 * True during the initial run of the computation at the time Deps.autorun is called,
		 * and false on subsequent reruns and at other times.
		 * 
		 * This property is a convenience to support the common pattern where a computation
		 * has logic specific to the first run.
		 */
		firstRun: boolean;

	}

	/**
	 * A Dependency represents an atomic unit of reactive data that a computation might depend on.
	 * Reactive data sources such as Session or Minimongo internally create different Dependency
	 * objects for different pieces of data, each of which may be depended on by multiple computations.
	 * When the data changes, the computations are invalidated.
	 */
	export class Dependency {

		/**
		 * Invalidate all dependent computations immediately and remove them as dependents.
		 */
		changed(): void;

		/**
		 * Declares that the current computation (or fromComputation if given) depends on
		 * dependency. The computation will be invalidated the next time dependency changes.
		 *
		 * If there is no current computation and depend() is called with no arguments,
		 * it does nothing and returns false.
		 *
		 * Returns true if the computation is a new dependent of dependency rather than an existing one.
		 *
		 * dep.depend() is used in reactive data source implementations to record the fact
		 * that dep is being accessed from the current computation.
		 *
		 * @param fromComputation An optional computation declared to depend on dependency
		 *                        instead of the current computation.
		 */
		depend(fromComputation?: Computation);

		/**
		 * True if this Dependency has one or more dependent Computations, which would be
		 * invalidated if this Dependency were to change.
		 *
		 * For reactive data sources that create many internal Dependencies, this function
		 * is useful to determine whether a particular Dependency is still tracking any
		 * dependency relationships or if it can be cleaned up to save memory.
		 */
		hasDependents(): boolean;

	}

}

declare module Meteor {

	module Router {
		
		export interface Filter {
			only?: string[];
			except?: string[];
		}

		/**
		 * Client side. Defina a route.
		 */
		export function add(page: {
			[url: string]: any;
		});
		
		/**
		 * Define a route.
		 */
		export function add(url: string, template: string): void;
		
		/**
		 * Define a route.
		 */
		export function add(url: string, handler: () => string): void;

		/**
		 * Define a route.
		 */
		export function add(url: string, handler: (...args: string[]) => string): void;

		/**
		 * Server side. Defina a route.
		 */
		export function add(url: string, method: string, handler: (...args: string[]) => string): void;

		/**
		 * Defina a route
		 */
		export function filters(filters: {
			[name: string]: (page) => string;
		});

		/**
		 * Define a route
		 */
		export function filter(name: string, Filter);

		/**
		 * Get the current page
		 */
		export function page();
		
		/**
		 * Navigate to url
		 */
		export function to(url: string);
	}
}

declare module Log {
	function debug(message: any): void;
	function info(message: any): void;
	function warn(message: any): void;
	function error(message: any): void;
}

declare module Npm {
	export function require(moduleName: string): any;
}

declare module Match {
	export function test(value, pattern): boolean;
	export function Where(condition): boolean;
	export function Optional(pattern): boolean;
	export function Error(description): void;
	export function OneOf(pattern1, pattern2?, pattern3?): boolean;
}

declare function check(value, pattern): void;

declare module DDP {

	export interface Server {
		publish_handlers: any;
		universal_publish_handlers: any[];
		method_handlers: any;

		/**
		 * map from id to session
		 */
		sessions: {[id: string]: Session};
	}
	
	export interface Session {
		id: string;

		server: Server;
		version: string;
		
		initialized: boolean;
		socket: any;
		
		blocked: boolean;
		workerRunning: boolean;
		
		// Sub objects for active subscriptions
		_namedSubs: {[id: string]: Subscription};

		_universalSubs: Subscription[];
		userId: string;
		collectionViews: any;
	}

	/**
	 * Connect to the server of a different Meteor application to subscribe
	 * to its document sets and invoke its remote methods.
	 *
	 * @param url The URL of another Meteor application.
	 */
	export function connect(url: string): Connection;

	export interface Subscription {

		/**
		 * Cancel the subscription. This will typically result in the server
		 * directing the client to remove the subscription's data from the client's cache.
		 */
		stop();

		/**
		 * True if the server has marked the subscription as ready. A reactive data source.
		 */
		ready(): boolean;

		/**
		 * This calls all stop callbacks and prevents the handler from updating any
		 * SessionCollectionViews further. It's used when the user unsubscribes or
		 * disconnects, as well as during setUserId re-runs. It does *NOT* send
		 * removed messages for the published objects; if that is necessary, call
		 * _removeAllDocuments first.
		 */
		_deactivate();
		_callStopCallbacks();
		_recreate();
		_runHandler();
		_removeAllDocuments();
		_name: string;
		_params: any;
		_ready: boolean;
		_documents: {[collection: string]: {[docId: string]: any}};

	}

	export interface Connection {

		/**
		 * Subscribe to a record set. Returns a handle that provides stop() and ready() methods.
		 *
		 * @param name Name of the subscription. Matches name of server's publish() call.
		 * @param arg1 Optional arguments passed to publisher function on server.
		 * @param arg2 Optional arguments passed to publisher function on server.
		 * @param arg3 Optional arguments passed to publisher function on server.
		 * @param callbacks Optional. May include onError and onReady callbacks.
		 *                  If a function is passed instead of an object,
		 *                  it is interpreted as an onReady callback.
		 */
		subscribe(name: string, arg1?: any, arg2?: any, arg3?: any, callbacks?: any): Subscription;

		/**
		 * Defines functions that can be invoked over the network by clients.
		 *
		 * @pardam methods Dictionary whose keys are method names and values are functions.
		 */
		methods(methods: {
			[methodName: string]: Function;
		});

		/**
		 * Dictionary whose keys are method names and values are functions.
		 *
		 * @param name Name of method to invoke
		 * @param param1 Optional method arguments
		 * @param param2 Optional method arguments
		 * @param param3 Optional method arguments
		 * @param asyncCallback Optional callback, which is called asynchronously with the error
		 *                      or result after the method is complete. If not provided,
		 *                      the method runs synchronously if possible (see below).
		 */
		call(name: string, arg1?: any, arg2?: any, arg3?: any, asyncCallback?: () => void ): any;

		/**
		 * Invoke a method passing an array of arguments.
		 *
		 * @param name Name of method to invoke
		 * @param args Method arguments
		 * @param options Optional callback; same semantics as in Meteor.call.
		 */
		apply(name: string, args?: any[], options?: {

			/**
			 * (Client only) If true, don't send this method until all previous
			 * method calls have completed, and don't send any subsequent method
			 * calls until this one is completed.
			 */
			wait?: boolean;

			/**
			 * (Client only) This callback is invoked with the error or result of
			 * the method (just like asyncCallback) as soon as the error or result
			 * is available. The local cache may not yet reflect the writes
			 * performed by the method.
			 */
			onResultReceived?: () => any;

		}, asyncCallback?: (err?, result?) => void ): any;

		/**
		 * Get the current connection status. A reactive data source.
		 */
		status(): {

			/**
			 * True if currently connected to the server. If false, changes and method
			 * invocations will be queued up until the connection is reestablished.
			 */
			connected: boolean;

			/**
			 * Describes the current reconnection status. The possible values are connected
			 * (the connection is up and running), connecting (disconnected and trying to
			 * open a new connection), failed (permanently failed to connect; e.g., the
			 * client and server support different versions of DDP) and waiting (failed to
			 * connect and waiting to try to reconnect).
			 */
			status: string;

			/**
			 * The number of times the client has tried to reconnect since the
			 * connection was lost. 0 when connected.
			 */
			retryCount: number;

			/**
			 * The estimated time of the next reconnection attempt. To turn this into an
			 * interval until the next reconnection, use  retryTime - (new Date()).getTime().
			 * This key will be set only when status is waiting.
			 */
			retryTime?: number;

			/**
			 * If status is failed, a description of why the connection failed.
			 */
			reason?: string;

			/**
			 * et this to a function to be called as the first step of reconnecting.
			 * This function can call methods which will be executed before any other
			 * outstanding methods. For example, this can be used to re-establish the
			 * appropriate authentication context on the new connection.
			 */
			onReconnect: () => void

		};

		/**
		 * Force an immediate reconnection attempt if the client is not connected to the server.
		 * This method does nothing if the client is already connected.
		 */
		reconnect(): void;

		/**
		 * Disconnect the client from the server.
		 */
		disconnect(): void;

		/**
		 * The IP address of the client in dotted form (such as "127.0.0.1").
		 *
		 * If you're running your Meteor server behind a proxy
		 * (so that clients are connecting to the proxy instead of to your server directly),
		 * you'll need to set the HTTP_FORWARDED_COUNT environment variable for the correct
		 * IP address to be reported by clientAddress.
		 *
		 * Set HTTP_FORWARDED_COUNT to an integer representing the number of proxies in front of your server.
		 * For example, you'd set it to "1" when your server was behind one proxy.
		 */
		clientAddress: string;

		httpHeaders: any;

	}

}

declare module Assets {

    /**
     * Retrieve the contents of the static server asset as a UTF8-encoded string.
     *
     * @param assetPath
     * @param asyncCallback
     */
    function getText(assetPath: string, asyncCallback?): string;

    /**
     * Retrieve the contents of the static server asset as an EJSON Binary.
     *
     * @param assetPath
     * @param asyncCallback
     */
    function getBinary(assetPath: string, asyncCallback?): string;

    /**
     * Retrieve the local filesystem path of the static server asset.
     *
     * @param assetPath
     * @param asyncCallback
     */
    function absoluteFilePath(assetPath: string, asyncCallback?): string;

}

declare module SRP {

	function generateVerifier(password: string, options: any): any;

}

interface EmailOptions {

	/**
	 * RFC5322 "From:" address (required)
	 */
	from: string

	/**
	 * RFC5322 "To:" address[es]
	 */
	to: any

	/**
	 *RFC5322 "Cc:" address[es]
	 */
	cc?: any

	/**
	 *RFC5322 "Bcc:" address[es]
	 */
	bcc?: any;

	/**
	 * RFC5322 "Reply-To:" address[es]
	 */
	replyTo?: any;

	/**
	 * RFC5322 "Subject:" line
	 */
	subject: string

	/**
	 * RFC5322 mail body (plain text)
	 */
	text?: string

	/**
	 * RFC5322 mail body (HTML)
	 */
	html?: string

	/**
	 * RFC5322 custom headers (dictionary)
	 */
	headers?: any

}

declare module Email {

	/**
	 * Send an email. Throws an Error on failure to contact mail server or if mail server returns an error.
	 *
	 * @param options
	 */
	function send(options: EmailOptions);

}

declare module Handlebars {
	function registerHelper(name: string, helper: any);
}

declare module UI {
	var body: Template;
	function registerHelper(name: string, helper: Function);
	function render(template: Template);
	function renderWithData(template: Template, data: any);
	function insert(instantiatedComponent: Template, parentNode, nextNode?);
	function getElementData(): any;
	function _templateInstance(): MeteorTemplate;
}

declare module Blaze {
	export var View: any;
}

declare module WebApp {
	var connectHandlers: {
		use(handler: (req, res, next) => any);
	}
}

declare module Facts {
	function setUserIdFilter(callback: Function);
}

declare module BrowserPolicy.framing {

	/**
	 * Your app will never render inside a frame or iframe.
	 */
	function disallow();

	/**
	 * Your app will only render inside frames loaded by origin.
	 * You can only call this function once with a single origin,
	 * and cannot use wildcards or specify multiple origins that
	 * are allowed to frame your app. (This is a limitation of the
	 * X-Frame-Options header.) Example values of origin include
	 * "http://example.com" and "https://foo.example.com".
	 * 
	 * @param origin
	 */
	function restrictToOrigin(origin: string);
	
	/**
	 * This unsets the X-Frame-Options header, so that your app can be framed by any webpage.
	 */
	function allowAll();
	
}

declare module BrowserPolicy.content {

	/**
	 * Allows inline <script> tags, javascript: URLs, and inline event handlers.
	 * The default policy already allows inline scripts.
	 */
	function allowInlineScripts();

	/**
	 * Disallows inline Javascript. Calling this function results in an extra
	 * round-trip on page load to retrieve Meteor runtime configuration that
	 * is usually part of an inline script tag.
	 */
	function disallowInlineScripts();

	/**
	 * Allows the creation of Javascript code from strings using function such as eval().
	 */
	function allowEval();
	
	/**
	 * Disallows eval and related functions. The default policy already disallows eval.
	 */
	function disallowEval();

	/**
	 * Allows inline style tags and style attributes. The default policy already allows inline styles.
	 */
	function allowInlineStyles();

	/**
	 * Disallows inline CSS.
	 */
	function disallowInlineStyles();

	function allowSameOriginForAll();
	function allowDataUrlForAll();
	function allowOriginForAll(origin: string);
	function disallowAll();
	function allowContentTypeSniffing();

	function allowImageOrigin(origin: string);
	function allowImageDataUrl();
	function allowImageSameOrigin();
	function disallowImage();

	function allowFontOrigin(origin: string);
	function allowFontDataUrl();
	function allowFontSameOrigin();
	function disallowFont();

	function allowConnectOrigin(origin: string);
	function allowConnectDataUrl();
	function allowConnectSameOrigin();
	function disallowConnect();

	function allowFrameOrigin(origin: string);
	function allowFrameDataUrl();
	function allowFrameSameOrigin();
	function disallowFrame();

	function allowStyleOrigin(origin: string);
	function allowStyleDataUrl();
	function allowStyleSameOrigin();
	function disallowStyle();

	function allowScriptOrigin(origin: string);
	function allowScriptDataUrl();
	function allowScriptSameOrigin();
	function disallowScript();

	function allowMediaOrigin(origin: string);
	function allowMediaDataUrl();
	function allowMediaSameOrigin();
	function disallowMedia();

	function allowObjectOrigin(origin: string);
	function allowObjectDataUrl();
	function allowObjectSameOrigin();
	function disallowObject();
	
}

declare module SpacebarsCompiler {
	function compile(template: string, data?: any);
}

declare module Mongo {

	/**
	 * Create a Mongo-style `ObjectID`.  If you don't specify a `hexString`, the `ObjectID` will generated randomly (not using MongoDB's ID construction rules).
	 *
	 * @locus Anywhere
	 *
	 * @param {String} hexString - <p>Optional.  The 24-character hexadecimal contents of the ObjectID to create</p>
	 */
	function ObjectID(hexString:string):ObjectID;

	class Collection {

		/**
		 * Constructor for a Collection
		 *
		 * @locus Anywhere
		 *
		 * @param {String} name - <p>The name of the collection.  If null, creates an unmanaged (unsynchronized) local collection.</p>
		 * @param {Options} [options]
		 */
		constructor(name:string,
						options?:{
							connection?:any;
							idGeneration?:string;
							transform?:Function
						});

		/**
		 * Allow users to write directly to this collection from client code, subject to limitations you define.
		 *
		 * @locus Server
		 *
		 * @param {Options} options
		 */
		allow(options:{
			insert?:Function;
			update?:Function;
			remove?:Function;
			fetch?:any;
			transform?:Function
		}):any;


		/**
		 * Override `allow` rules.
		 *
		 * @locus Server
		 *
		 * @param {Options} options
		 */
		deny(options:{
			insert?:Function;
			update?:Function;
			remove?:Function;
			fetch?:any;
			transform?:Function
		}):any;


		/**
		 * Find the documents in a collection that match the selector.
		 *
		 * @locus Anywhere
		 *
		 * @param {MongoSelector} [selector] - <p>A query describing the documents to find</p>
		 * @param {Options} [options]
		 */
		find(selector?:any,
			  options?:{
				  sort?:any;
				  skip?:Number;
				  limit?:Number;
				  fields?:any;
				  reactive?:boolean;
				  transform?:Function
			  }):Cursor;


		/**
		 * Finds the first document that matches the selector, as ordered by sort and skip options.
		 *
		 * @locus Anywhere
		 *
		 * @param {MongoSelector} [selector] - <p>A query describing the documents to find</p>
		 * @param {Options} [options]
		 */
		findOne(selector?:any,
				  options?:{
					  sort?:any;
					  skip?:Number;
					  fields?:any;
					  reactive?:boolean;
					  transform?:Function
				  }):any;


		/**
		 * Insert a document in the collection.  Returns its unique _id.
		 *
		 * @locus Anywhere
		 *
		 * @param {Object} doc - <p>The document to insert. May not yet have an _id attribute, in which case Meteor will generate one for you.</p>
		 * @param {function} [callback] - <p>Optional.  If present, called with an error object as the first argument and, if no error, the _id as the second.</p>
		 */
		insert(doc:any, callback?:Function):any;


		/**
		 * Remove documents from the collection
		 *
		 * @locus Anywhere
		 *
		 * @param {MongoSelector} selector - <p>Specifies which documents to remove</p>
		 * @param {function} [callback] - <p>Optional.  If present, called with an error object as its argument.</p>
		 */
		remove(selector:any, callback?:Function):any;


		/**
		 * Modify one or more documents in the collection. Returns the number of affected documents.
		 *
		 * @locus Anywhere
		 *
		 * @param {MongoSelector} selector - <p>Specifies which documents to modify</p>
		 * @param {MongoModifier} modifier - <p>Specifies how to modify the documents</p>
		 * @param {Options} [options]
		 * @param {function} [callback] - <p>Optional.  If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.</p>
		 */
		update(selector:any,
				 modifier:any,
				 options?:{
					 multi?:boolean;
					 upsert?:boolean
				 },
				 callback?:Function):any;


		/**
		 * Modify one or more documents in the collection, or insert one if no matching documents were found. Returns an object with keys `numberAffected` (the number of documents modified)  and `insertedId` (the unique _id of the document that was inserted, if any).
		 *
		 * @locus Anywhere
		 *
		 * @param {MongoSelector} selector - <p>Specifies which documents to modify</p>
		 * @param {MongoModifier} modifier - <p>Specifies how to modify the documents</p>
		 * @param {Options} [options]
		 * @param {function} [callback] - <p>Optional.  If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.</p>
		 */
		upsert(selector:any,
				 modifier:any,
				 options?:{
					 multi?:boolean
				 },
				 callback?:Function):any;

	}


	interface Cursor {

		/**
		 * Returns the number of documents that match a query.
		 *
		 * @locus Anywhere
		 */
		count():any;


		/**
		 * Return all matching documents as an Array.
		 *
		 * @locus Anywhere
		 */
		fetch():any;


		/**
		 * Call `callback` once for each matching document, sequentially and synchronously.
		 *
		 * @locus Anywhere
		 *
		 * @param {function} callback - <p>Function to call. It will be called with three arguments: the document, a 0-based index, and <em>cursor</em> itself.</p>
		 * @param {Any} [thisArg] - <p>An object which will be the value of <code>this</code> inside <code>callback</code>.</p>
		 */
		forEach(callback:Function, thisArg?:any):any;


		/**
		 * Map callback over all matching documents.  Returns an Array.
		 *
		 * @locus Anywhere
		 *
		 * @param {function} callback - <p>Function to call. It will be called with three arguments: the document, a 0-based index, and <em>cursor</em> itself.</p>
		 * @param {Any} [thisArg] - <p>An object which will be the value of <code>this</code> inside <code>callback</code>.</p>
		 */
		map(callback:Function, thisArg?:any):any;


		/**
		 * Watch a query.  Receive callbacks as the result set changes.
		 *
		 * @locus Anywhere
		 *
		 * @param {Object} callbacks - <p>Functions to call to deliver the result set as it changes</p>
		 */
		observe(callbacks:any):any;


		/**
		 * Watch a query.  Receive callbacks as the result set changes.  Only the differences between the old and new documents are passed to the callbacks.
		 *
		 * @locus Anywhere
		 *
		 * @param {Object} callbacks - <p>Functions to call to deliver the result set as it changes</p>
		 */
		observeChanges(callbacks:any):any;

	}


	interface ObjectID {

	}


}

interface EJSONable {
	[key: string]: number | string | boolean | Object | number[] | string[] | Object[] | Date | Uint8Array | EJSON.CustomType;
}

interface JSONable {
	[key: string]: number | string | boolean | Object | number[] | string[] | Object[];
}

interface EJSON extends EJSONable {}

declare module EJSON {

	var CustomType:CustomTypeStatic;

	interface CustomTypeStatic {
		new(): CustomType;
	}

	interface CustomType {
		clone(): EJSON.CustomType;
		equals(other:Object): boolean;
		toJSONValue(): JSON;
		typeName(): string;
	}

	function addType(name:string, factory:(val:EJSONable) => JSONable):void;
	function clone<T>(val:T):T;
	function equals(a:EJSON, b:EJSON, options?:{keyOrderSensitive?: boolean;}):boolean;
	function fromJSONValue(val:JSON):any;
	function isBinary(x:Object):boolean;
	var newBinary:any;
	function parse(str:string):EJSON;
	function stringify(val:EJSON, options?:{indent?: boolean | number | string; canonical?: boolean;}):string;
	function toJSONValue(val:EJSON):JSON;
}

declare class ReactiveVar<T> {
	constructor(initialValue: T, equalsFunc?: (a: T, b: T) => boolean);
	set(value: T);
	get(): T;
}

declare class ReactiveDict {
	set(name: string, value: any);
	get(name: string): any;
}
