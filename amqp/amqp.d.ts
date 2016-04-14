

	function createConnection(options, implOptions): Connection;

	interface Connection {
		publish: (routingKey, body, options, callback: Function) => void;
		disconnect: () => void;
		queue: (name, options?, openCallback?: Function) => Queue;
		exchange: (name?, options?, openCallback?: Function) => Exchange;
		on: (name: string, callback?: Function) => void;
	}

	interface Queue {
		subscribe: (options, listener: Function) => void;
		subscribeRaw: (options, listener: Function) => void;
		unsubscribe: (consumerTag) => void;
		shift: (reject?, requeue?) => void;
		bind: (exchange?, routing?) => void;
		unbind: (exchange?, routing?) => void;
		bind_headers: (exchange?, routing?) => void;
		destroy: (options) => void;
	}

	interface Exchange {
		publish: (routingKey, message, options, callback: Function) => void;
		destroy: (ifUnused: boolean) => void;
		bind: (srcExchange, routingKey, callback?: Function) => void;
		unbind: (srcExchange, routingKey, callback?: Function) => void;
		bind_headers: (exchange, routing, bindCallback?: Function) => void;
	}

