/// <reference path="meteor.d.ts" />

declare module FS {

	interface FileOptions {
		store: string;
	}

	class File {

		public _id: string;

		/**
		 * this property not stored in DB
		 */
		public collectionName: string;

		public collection: Meteor.Collection;

		/**
		 * this property not stored in DB
		 */
		public createdByTransform: boolean;

		/**
		 * this property not stored in DB
		 */
		public data: any;

		private original: {
			name: string;
			size: number;
			type: string;
			updatedAt: Date;
		};

		private copies: {[storeName: string]: {
			key: string;
			name: string;
			size: number;
			type: string;
			createdAt: Date;
			updatedAt: Date;
		}};

		private uploadedAt: Date;

		public isMounted(): boolean;

		public anyUserDefinedProp: Date;

		name(name?: string, options?: FileOptions): string;
		extension(name?: string, options?: FileOptions): string;
		size(name?: string, options?: FileOptions): any;
		formattedSize(name?: string, options?: FileOptions): string;
		type(name?: string, options?: FileOptions): string;
		updatedAt(name?: string, options?: FileOptions): Date;

		name(options?: FileOptions): string;
		extension(options?: FileOptions): string;
		size(options?: FileOptions): any;
		formattedSize(options?: FileOptions): string;
		type(options?: FileOptions): string;
		updatedAt(options?: FileOptions): Date;

		directUrl(): string;

	}

	interface FilterRule {

		/**
		 * You can mix and match filtering based on extension or content types.
		 * The contentTypes array also supports "image/*" and "audio/*" and
		 * "video/*" like the "accepts" attribute on the HTML5 file input element.
		 */
		contentTypes?: string[];

		/**
		 * If a file extension or content type matches any of those listed in allow, it is allowed.
		 * If not, it is denied. If it matches both allow and deny, it is denied.
		 * Typically, you would use only allow or only deny, but not both.
		 * If you do not pass the filter option, all files are allowed, as long as they pass
		 * the tests in your FS.Collection.allow() and FS.Collection.deny() functions.
		 *
		 * The extension checks are used only when there is a filename. It's possible to upload a
		 * file with no name. Thus, you should generally use extension checks only in addition
		 * to content type checks, and not instead of content type checks.
		 *
		 * The file extensions must be specified without a leading period. Extension matching is case-insensitive.
		 */
		extensions?: string[];

	}

	interface Filter {
		/**
		 * in bytes
		 */
		maxSize: number;
		allow?: FilterRule;
		deny?: FilterRule;
		onInvalid: (message:string) => void;
		ACL?: string;
	}

	interface CollectionOptions {
		stores: FS.Store.Base[];
		filter?: Filter;
	}

	class Collection extends Meteor.Collection {
		constructor(name:string, options:CollectionOptions);
		addFilters(filter:Filter);
	}

}

declare module FS.Store {

	interface Base {

	}

	interface S3Options {

		region?: string

		/**
		 * Account or IAM key. Required if environment variables are not set.
		 */
		accessKeyId?: string;

		/**
		 * Account or IAM secret. Required if environment variables are not set.
		 */
		secretAccessKey?: string;

		bucket: string;

		/**
		 * default is 'private', but you can allow public or secure access routed through your app URL
		 * The rest are generic store options supported by all storage adapters
		 *
		 * The most common will be ACL, for which the allowed values are:
		 * "private"
		 * "public-read"
		 * "public-read-write"
		 * "authenticated-read"
		 * "bucket-owner-read"
		 * "bucket-owner-full-control"
		 */
		ACL?: any;

		transformWrite?: Function;

		transformRead?: Function;

		/**
		 * default 5
		 */
		maxTries?: number;
	}

	class S3 implements Base {
		constructor(name:string, options:S3Options);
		bucket: string;
		name: string;
	}

}

declare module FS.Utility {
	export function eachFile(event: MeteorTemplateEvent, callback: (file) => void);
}
