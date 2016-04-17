declare module UI {
	var body: Template;
	function registerHelper(name: string, helper: Function);
	function render(template: Template);
	function renderWithData(template: Template, data: any);
	function insert(instantiatedComponent: Template, parentNode, nextNode?);
	function getElementData(): any;
	function _templateInstance(): MeteorTemplate;
}

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
