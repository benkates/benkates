/* Carrd Site JS | carrd.co | License: MIT */

(function() {

	// Main.
		var	on = addEventListener,
			off = removeEventListener,
			$ = function(q) { return document.querySelector(q) },
			$$ = function(q) { return document.querySelectorAll(q) },
			$body = document.body,
			$inner = $('.inner'),
			client = (function() {
		
				var o = {
						browser: 'other',
						browserVersion: 0,
						os: 'other',
						osVersion: 0,
						mobile: false,
						canUse: null,
						flags: {
							lsdUnits: false,
						},
					},
					ua = navigator.userAgent,
					a, i;
		
				// browser, browserVersion.
					a = [
						[
							'firefox',
							/Firefox\/([0-9\.]+)/
						],
						[
							'edge',
							/Edge\/([0-9\.]+)/
						],
						[
							'safari',
							/Version\/([0-9\.]+).+Safari/
						],
						[
							'chrome',
							/Chrome\/([0-9\.]+)/
						],
						[
							'chrome',
							/CriOS\/([0-9\.]+)/
						],
						[
							'ie',
							/Trident\/.+rv:([0-9]+)/
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.browser = a[i][0];
							o.browserVersion = parseFloat(RegExp.$1);
		
							break;
		
						}
		
					}
		
				// os, osVersion.
					a = [
						[
							'ios',
							/([0-9_]+) like Mac OS X/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'ios',
							/CPU like Mac OS X/,
							function(v) { return 0 }
						],
						[
							'ios',
							/iPad; CPU/,
							function(v) { return 0 }
						],
						[
							'android',
							/Android ([0-9\.]+)/,
							null
						],
						[
							'mac',
							/Macintosh.+Mac OS X ([0-9_]+)/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'windows',
							/Windows NT ([0-9\.]+)/,
							null
						],
						[
							'undefined',
							/Undefined/,
							null
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.os = a[i][0];
							o.osVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
		
							break;
		
						}
		
					}
		
					// Hack: Detect iPads running iPadOS.
						if (o.os == 'mac'
						&&	('ontouchstart' in window)
						&&	(
		
							// 12.9"
								(screen.width == 1024 && screen.height == 1366)
							// 10.2"
								||	(screen.width == 834 && screen.height == 1112)
							// 9.7"
								||	(screen.width == 810 && screen.height == 1080)
							// Legacy
								||	(screen.width == 768 && screen.height == 1024)
		
						))
							o.os = 'ios';
		
				// mobile.
					o.mobile = (o.os == 'android' || o.os == 'ios');
		
				// canUse.
					var _canUse = document.createElement('div');
		
					o.canUse = function(property, value) {
		
						var style;
		
						// Get style.
							style = _canUse.style;
		
						// Property doesn't exist? Can't use it.
							if (!(property in style))
								return false;
		
						// Value provided?
							if (typeof value !== 'undefined') {
		
								// Assign value.
									style[property] = value;
		
								// Value is empty? Can't use it.
									if (style[property] == '')
										return false;
		
							}
		
						return true;
		
					};
		
				// flags.
					o.flags.lsdUnits = o.canUse('width', '100dvw');
		
				return o;
		
			}()),
			trigger = function(t) {
				dispatchEvent(new Event(t));
			},
			cssRules = function(selectorText) {
		
				var ss = document.styleSheets,
					a = [],
					f = function(s) {
		
						var r = s.cssRules,
							i;
		
						for (i=0; i < r.length; i++) {
		
							if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)
								(f)(r[i]);
							else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText)
								a.push(r[i]);
		
						}
		
					},
					x, i;
		
				for (i=0; i < ss.length; i++)
					f(ss[i]);
		
				return a;
		
			},
			thisHash = function() {
		
				var h = location.hash ? location.hash.substring(1) : null,
					a;
		
				// Null? Bail.
					if (!h)
						return null;
		
				// Query string? Move before hash.
					if (h.match(/\?/)) {
		
						// Split from hash.
							a = h.split('?');
							h = a[0];
		
						// Update hash.
							history.replaceState(undefined, undefined, '#' + h);
		
						// Update search.
							window.location.search = a[1];
		
					}
		
				// Prefix with "x" if not a letter.
					if (h.length > 0
					&&	!h.match(/^[a-zA-Z]/))
						h = 'x' + h;
		
				// Convert to lowercase.
					if (typeof h == 'string')
						h = h.toLowerCase();
		
				return h;
		
			},
			scrollToElement = function(e, style, duration) {
		
				var y, cy, dy,
					start, easing, offset, f;
		
				// Element.
		
					// No element? Assume top of page.
						if (!e)
							y = 0;
		
					// Otherwise ...
						else {
		
							offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
		
							switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
		
								case 'default':
								default:
		
									y = e.offsetTop + offset;
		
									break;
		
								case 'center':
		
									if (e.offsetHeight < window.innerHeight)
										y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2) + offset;
									else
										y = e.offsetTop - offset;
		
									break;
		
								case 'previous':
		
									if (e.previousElementSibling)
										y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset;
									else
										y = e.offsetTop + offset;
		
									break;
		
							}
		
						}
		
				// Style.
					if (!style)
						style = 'smooth';
		
				// Duration.
					if (!duration)
						duration = 750;
		
				// Instant? Just scroll.
					if (style == 'instant') {
		
						window.scrollTo(0, y);
						return;
		
					}
		
				// Get start, current Y.
					start = Date.now();
					cy = window.scrollY;
					dy = y - cy;
		
				// Set easing.
					switch (style) {
		
						case 'linear':
							easing = function (t) { return t };
							break;
		
						case 'smooth':
							easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
							break;
		
					}
		
				// Scroll.
					f = function() {
		
						var t = Date.now() - start;
		
						// Hit duration? Scroll to y and finish.
							if (t >= duration)
								window.scroll(0, y);
		
						// Otherwise ...
							else {
		
								// Scroll.
									window.scroll(0, cy + (dy * easing(t / duration)));
		
								// Repeat.
									requestAnimationFrame(f);
		
							}
		
					};
		
					f();
		
			},
			scrollToTop = function() {
		
				// Scroll to top.
					scrollToElement(null);
		
			},
			loadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of unloaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Load.
								a[i].contentWindow.location.replace(a[i].dataset.src);
		
							// Save initial src.
								a[i].dataset.initialSrc = a[i].dataset.src;
		
							// Mark as loaded.
								a[i].dataset.src = '';
		
						}
		
				// Video.
		
					// Get list of videos (autoplay).
						a = parent.querySelectorAll('video[autoplay]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Play if paused.
								if (a[i].paused)
									a[i].play();
		
						}
		
				// Autofocus.
		
					// Get first element with data-autofocus attribute.
						e = parent.querySelector('[data-autofocus="1"]');
		
					// Determine type.
						x = e ? e.tagName : null;
		
						switch (x) {
		
							case 'FORM':
		
								// Get first input.
									e = e.querySelector('.field input, .field select, .field textarea');
		
								// Found? Focus.
									if (e)
										e.focus();
		
								break;
		
							default:
								break;
		
						}
		
			},
			unloadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of loaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src=""]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Don't unload? Skip.
								if (a[i].dataset.srcUnload === '0')
									continue;
		
							// Mark as unloaded.
		
								// IFRAME was previously loaded by loadElements()? Use initialSrc.
									if ('initialSrc' in a[i].dataset)
										a[i].dataset.src = a[i].dataset.initialSrc;
		
								// Otherwise, just use src.
									else
										a[i].dataset.src = a[i].src;
		
							// Unload.
								a[i].contentWindow.location.replace('about:blank');
		
						}
		
				// Video.
		
					// Get list of videos.
						a = parent.querySelectorAll('video');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Pause if playing.
								if (!a[i].paused)
									a[i].pause();
		
						}
		
				// Autofocus.
		
					// Get focused element.
						e = $(':focus');
		
					// Found? Blur.
						if (e)
							e.blur();
		
		
			};
		
			// Expose scrollToElement.
				window._scrollToTop = scrollToTop;
	
	// "On Load" animation.
		// Create load handler.
			var loadHandler = function() {
				setTimeout(function() {
		
					// Unmark as loading.
						$body.classList.remove('is-loading');
		
					// Mark as playing.
						$body.classList.add('is-playing');
		
					// Wait for animation complete.
						setTimeout(function() {
		
							// Unmark as playing.
								$body.classList.remove('is-playing');
		
							// Mark as ready.
								$body.classList.add('is-ready');
		
						}, 1000);
		
				}, 100);
			};
		
		// Load event.
			on('load', loadHandler);
	
	// Load elements.
		// Load elements (if needed).
			loadElements(document.body);
	
	// Browser hacks.
		// Init.
			var style, sheet, rule;
		
			// Create <style> element.
				style = document.createElement('style');
				style.appendChild(document.createTextNode(''));
				document.head.appendChild(style);
		
			// Get sheet.
				sheet = style.sheet;
		
		// Mobile.
			if (client.mobile) {
		
				// Prevent overscrolling on Safari/other mobile browsers.
				// 'vh' units don't factor in the heights of various browser UI elements so our page ends up being
				// a lot taller than it needs to be (resulting in overscroll and issues with vertical centering).
					(function() {
		
						// Lsd units available?
							if (client.flags.lsdUnits) {
		
								document.documentElement.style.setProperty('--viewport-height', '100svh');
								document.documentElement.style.setProperty('--background-height', '100lvh');
		
							}
		
						// Otherwise, use innerHeight hack.
							else {
		
								var f = function() {
									document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
									document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
								};
		
								on('load', f);
								on('orientationchange', function() {
		
									// Update after brief delay.
										setTimeout(function() {
											(f)();
										}, 100);
		
								});
		
							}
		
					})();
		
			}
		
		// Android.
			if (client.os == 'android') {
		
				// Prevent background "jump" when address bar shrinks.
				// Specifically, this fix forces the background pseudoelement to a fixed height based on the physical
				// screen size instead of relying on "vh" (which is subject to change when the scrollbar shrinks/grows).
					(function() {
		
						// Insert and get rule.
							sheet.insertRule('body::after { }', 0);
							rule = sheet.cssRules[0];
		
						// Event.
							var f = function() {
								rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
							};
		
							on('load', f);
							on('orientationchange', f);
							on('touchmove', f);
		
					})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
		
		// iOS.
			else if (client.os == 'ios') {
		
				// <=11: Prevent white bar below background when address bar shrinks.
				// For some reason, simply forcing GPU acceleration on the background pseudoelement fixes this.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body::after { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = '-webkit-transform: scale(1.0)';
		
						})();
		
				// <=11: Prevent white bar below background when form inputs are focused.
				// Fixed-position elements seem to lose their fixed-ness when this happens, which is a problem
				// because our backgrounds fall into this category.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body.ios-focus-fix::before { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = 'height: calc(100% + 60px)';
		
							// Add event listeners.
								on('focus', function(event) {
									$body.classList.add('ios-focus-fix');
								}, true);
		
								on('blur', function(event) {
									$body.classList.remove('ios-focus-fix');
								}, true);
		
						})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
	
	// Visibility.
		(function() {
		
			var	elements = $$('[data-visibility]');
		
			// Initialize elements.
				elements.forEach(function(e) {
		
					var	p = e.parentElement,
						state = false,
						nextSibling = null,
						ne, query;
		
					// Determine next element.
						for (ne = e.nextSibling; ne; ne = ne.nextSibling) {
		
							// Not a node? Skip.
								if (ne.nodeType != 1)
									continue;
		
							// No visibility setting? Found our next element so bail.
								if (!ne.dataset.visibility)
									break;
		
						}
		
					// Determine media query at which to hide element.
						switch (e.dataset.visibility) {
		
							case 'mobile':
								query = '(min-width: 737px)';
								break;
		
							case 'desktop':
								query = '(max-width: 736px)';
								break;
		
							default:
								return;
		
						}
		
					// Create handler.
						f = function() {
		
							// Matches media query?
								if (window.matchMedia(query).matches) {
		
									// Hasn't been applied yet?
										if (!state) {
		
											// Mark as applied.
												state = true;
		
											// Hide element (= remove from DOM).
												p.removeChild(e);
		
										}
		
								}
		
							// Otherwise ...
								else {
		
									// Previously applied?
										if (state) {
		
											// Unmark as applied.
												state = false;
		
											// Show element (= reinsert before next element).
												p.insertBefore(e, ne);
		
										}
		
								}
		
						};
		
					// Add event listeners.
						on('resize', f);
						on('orientationchange', f);
						on('load', f);
						on('fullscreenchange', f);
		
				});
		
		})();
	
	// Scroll events.
		var scrollEvents = {
		
			/**
			 * Items.
			 * @var {array}
			 */
			items: [],
		
			/**
			 * Adds an event.
			 * @param {object} o Options.
			 */
			add: function(o) {
		
				this.items.push({
					element: o.element,
					triggerElement: (('triggerElement' in o && o.triggerElement) ? o.triggerElement : o.element),
					enter: ('enter' in o ? o.enter : null),
					leave: ('leave' in o ? o.leave : null),
					mode: ('mode' in o ? o.mode : 3),
					offset: ('offset' in o ? o.offset : 0),
					initialState: ('initialState' in o ? o.initialState : null),
					state: false,
				});
		
			},
		
			/**
			 * Handler.
			 */
			handler: function() {
		
				var	height, top, bottom, scrollPad;
		
				// Determine values.
					if (client.os == 'ios') {
		
						height = document.documentElement.clientHeight;
						top = document.body.scrollTop + window.scrollY;
						bottom = top + height;
						scrollPad = 125;
		
					}
					else {
		
						height = document.documentElement.clientHeight;
						top = document.documentElement.scrollTop;
						bottom = top + height;
						scrollPad = 0;
		
					}
		
				// Step through items.
					scrollEvents.items.forEach(function(item) {
		
						var bcr, elementTop, elementBottom, state, a, b;
		
						// No enter/leave handlers? Bail.
							if (!item.enter
							&&	!item.leave)
								return true;
		
						// No trigger element? Bail.
							if (!item.triggerElement)
								return true;
		
						// Trigger element not visible?
							if (item.triggerElement.offsetParent === null) {
		
								// Current state is active *and* leave handler exists?
									if (item.state == true
									&&	item.leave) {
		
										// Reset state to false.
											item.state = false;
		
										// Call it.
											(item.leave).apply(item.element);
		
										// No enter handler? Unbind leave handler (so we don't check this element again).
											if (!item.enter)
												item.leave = null;
		
									}
		
								// Bail.
									return true;
		
							}
		
						// Get element position.
							bcr = item.triggerElement.getBoundingClientRect();
							elementTop = top + Math.floor(bcr.top);
							elementBottom = elementTop + bcr.height;
		
						// Determine state.
		
							// Initial state exists?
								if (item.initialState !== null) {
		
									// Use it for this check.
										state = item.initialState;
		
									// Clear it.
										item.initialState = null;
		
								}
		
							// Otherwise, determine state from mode/position.
								else {
		
									switch (item.mode) {
		
										// Element falls within viewport.
											case 1:
											default:
		
												// State.
													state = (bottom > (elementTop - item.offset) && top < (elementBottom + item.offset));
		
												break;
		
										// Viewport midpoint falls within element.
											case 2:
		
												// Midpoint.
													a = (top + (height * 0.5));
		
												// State.
													state = (a > (elementTop - item.offset) && a < (elementBottom + item.offset));
		
												break;
		
										// Viewport midsection falls within element.
											case 3:
		
												// Upper limit (25%-).
													a = top + (height * 0.25);
		
													if (a - (height * 0.375) <= 0)
														a = 0;
		
												// Lower limit (-75%).
													b = top + (height * 0.75);
		
													if (b + (height * 0.375) >= document.body.scrollHeight - scrollPad)
														b = document.body.scrollHeight + scrollPad;
		
												// State.
													state = (b > (elementTop - item.offset) && a < (elementBottom + item.offset));
		
												break;
		
									}
		
								}
		
						// State changed?
							if (state != item.state) {
		
								// Update state.
									item.state = state;
		
								// Call handler.
									if (item.state) {
		
										// Enter handler exists?
											if (item.enter) {
		
												// Call it.
													(item.enter).apply(item.element);
		
												// No leave handler? Unbind enter handler (so we don't check this element again).
													if (!item.leave)
														item.enter = null;
		
											}
		
									}
									else {
		
										// Leave handler exists?
											if (item.leave) {
		
												// Call it.
													(item.leave).apply(item.element);
		
												// No enter handler? Unbind leave handler (so we don't check this element again).
													if (!item.enter)
														item.leave = null;
		
											}
		
									}
		
							}
		
					});
		
			},
		
			/**
			 * Initializes scroll events.
			 */
			init: function() {
		
				// Bind handler to events.
					on('load', this.handler);
					on('resize', this.handler);
					on('scroll', this.handler);
		
				// Do initial handler call.
					(this.handler)();
		
			}
		};
		
		// Initialize.
			scrollEvents.init();
	
	// Deferred.
		(function() {
		
			var items = $$('.deferred'),
				loadHandler, enterHandler;
		
			// Handlers.
		
				/**
				 * "On Load" handler.
				 */
				loadHandler = function() {
		
					var i = this,
						p = this.parentElement;
		
					// Not "done" yet? Bail.
						if (i.dataset.src !== 'done')
							return;
		
					// Show image.
						if (Date.now() - i._startLoad < 375) {
		
							p.classList.remove('loading');
							p.style.backgroundImage = 'none';
							i.style.transition = '';
							i.style.opacity = 1;
		
						}
						else {
		
							p.classList.remove('loading');
							i.style.opacity = 1;
		
							setTimeout(function() {
								i.style.backgroundImage = 'none';
								i.style.transition = '';
							}, 375);
		
						}
		
				};
		
				/**
				 * "On Enter" handler.
				 */
				enterHandler = function() {
		
					var	i = this,
						p = this.parentElement,
						src;
		
					// Get src, mark as "done".
						src = i.dataset.src;
						i.dataset.src = 'done';
		
					// Mark parent as loading.
						p.classList.add('loading');
		
					// Swap placeholder for real image src.
						i._startLoad = Date.now();
						i.src = src;
		
				};
		
			// Initialize items.
				items.forEach(function(p) {
		
					var i = p.firstElementChild;
		
					// Set parent to placeholder.
						if (!p.classList.contains('enclosed')) {
		
							p.style.backgroundImage = 'url(' + i.src + ')';
							p.style.backgroundSize = '100% 100%';
							p.style.backgroundPosition = 'top left';
							p.style.backgroundRepeat = 'no-repeat';
		
						}
		
					// Hide image.
						i.style.opacity = 0;
						i.style.transition = 'opacity 0.375s ease-in-out';
		
					// Load event.
						i.addEventListener('load', loadHandler);
		
					// Add to scroll events.
						scrollEvents.add({
							element: i,
							enter: enterHandler,
							offset: 250,
						});
		
				});
		
		})();
	
	// Gallery.
		/**
		* Lightbox gallery.
		*/
		function lightboxGallery() {
		
		var _this = this;
		
		/**
		 * ID.
		 * @var {string}
		 */
		this.id = 'gallery';
		
		/**
		 * Wrapper.
		 * @var {DOMElement}
		 */
		this.$wrapper = $('#' + this.id);
		
		/**
		 * Modal.
		 * @var {DOMElement}
		 */
		this.$modal = null;
		
		/**
		 * Modal image.
		 * @var {DOMElement}
		 */
		this.$modalImage = null;
		
		/**
		 * Modal next.
		 * @var {DOMElement}
		 */
		this.$modalNext = null;
		
		/**
		 * Modal previous.
		 * @var {DOMElement}
		 */
		this.$modalPrevious = null;
		
		/**
		 * Links.
		 * @var {nodeList}
		 */
		this.$links = null;
		
		/**
		 * Lock state.
		 * @var {bool}
		 */
		this.locked = false;
		
		/**
		 * Current index.
		 * @var {integer}
		 */
		this.current = null;
		
		/**
		 * Transition delay (must match CSS).
		 * @var {integer}
		 */
		this.delay = 375;
		
		/**
		 * Navigation state.
		 * @var {bool}
		 */
		this.navigation = null;
		
		/**
		 * Mobile state.
		 * @var {bool}
		 */
		this.mobile = null;
		
		/**
		 * Protect state.
		 * @var {bool}
		 */
		this.protect = null;
		
		/**
		 * Zoom interval ID.
		 * @var {integer}
		 */
		this.zoomIntervalId = null;
		
		// Init modal.
			this.initModal();
		
		};
		
		/**
		 * Initialize.
		 * @param {object} config Config.
		 */
		lightboxGallery.prototype.init = function(config) {
		
			var _this = this,
				$links = $$('#' + config.id + ' .thumbnail'),
				navigation = config.navigation,
				mobile = config.mobile,
				mobileNavigation = config.mobileNavigation,
				protect = ('protect' in config ? config.protect : false),
				i, j;
		
			// Determine if navigation needs to be disabled (despite what our config says).
				j = 0;
		
				// Step through items.
					for (i = 0; i < $links.length; i++) {
		
						// Not ignored? Increment count.
							if ($links[i].dataset.lightboxIgnore != '1')
								j++;
		
					}
		
				// Less than two allowed items? Disable navigation.
					if (j < 2)
						navigation = false;
		
			// Bind click events.
				for (i=0; i < $links.length; i++) {
		
					// Ignored? Skip.
						if ($links[i].dataset.lightboxIgnore == '1')
							continue;
		
					// Bind click event.
						(function(index) {
							$links[index].addEventListener('click', function(event) {
		
								// Prevent default.
									event.stopPropagation();
									event.preventDefault();
		
								// Show.
									_this.show(index, {
										$links: $links,
										navigation: navigation,
										mobile: mobile,
										mobileNavigation: mobileNavigation,
										protect: protect,
									});
		
							});
						})(i);
		
				}
		
		};
		
		/**
		 * Init modal.
		 */
		lightboxGallery.prototype.initModal = function() {
		
			var	_this = this,
				dragStart = null,
				dragEnd = null,
				$modal,
				$modalInner,
				$modalImage,
				$modalNext,
				$modalPrevious;
		
			// Build element.
				$modal = document.createElement('div');
					$modal.id = this.id + '-modal';
					$modal.tabIndex = -1;
					$modal.className = 'gallery-modal';
					$modal.innerHTML = '<div class="inner"><img src="" /></div><div class="nav previous"></div><div class="nav next"></div><div class="close"></div>';
					$body.appendChild($modal);
		
				// Inner.
					$modalInner = $('#' + this.id + '-modal .inner');
		
				// Image.
					$modalImage = $('#' + this.id + '-modal img');
		
					// Load event.
						$modalImage.addEventListener('load', function() {
		
							// Mark as done.
								$modal.classList.add('done');
		
							// Delay (wait for visible transition, if not switching).
								setTimeout(function() {
		
									// No longer visible? Bail.
										if (!$modal.classList.contains('visible'))
											return;
		
									// Set loaded.
										$modal.classList.add('loaded');
		
									// Clear switching after delay.
										setTimeout(function() {
											$modal.classList.remove('switching', 'from-left', 'from-right', 'done');
										}, _this.delay);
		
								}, ($modal.classList.contains('switching') ? 0 : _this.delay));
		
						});
		
					// Contextmenu event.
						$modalImage.addEventListener('contextmenu', function() {
		
							// Protected? Prevent default.
								if (_this.protect)
									event.preventDefault();
		
						}, true);
		
					// Dragstart event.
						$modalImage.addEventListener('dragstart', function() {
		
							// Protected? Prevent default.
								if (_this.protect)
									event.preventDefault();
		
						}, true);
		
				// Navigation.
					$modalNext = $('#' + this.id + '-modal .next');
					$modalPrevious = $('#' + this.id + '-modal .previous');
		
			// Methods.
				$modal.show = function(index, offset, direction) {
		
					var item,
						i, j, found;
		
					// Locked? Bail.
						if (_this.locked)
							return;
		
					// No index provided? Use current.
						if (typeof index != 'number')
							index = _this.current;
		
					// Offset provided? Find first allowed offset item.
						if (typeof offset == 'number') {
		
							found = false;
							j = 0;
		
							// Step through items using offset (up to item count).
								for (j = 0; j < _this.$links.length; j++) {
		
									// Increment index by offset.
										index += offset;
		
									// Less than zero? Jump to end.
										if (index < 0)
											index = _this.$links.length - 1;
		
									// Greater than length? Jump to beginning.
										else if (index >= _this.$links.length)
											index = 0;
		
									// Already there? Bail.
										if (index == _this.current)
											break;
		
									// Get item.
										item = _this.$links.item(index);
		
										if (!item)
											break;
		
									// Not ignored? Found!
										if (item.dataset.lightboxIgnore != '1') {
		
											found = true;
											break;
		
										}
		
								}
		
							// Couldn't find an allowed item? Bail.
								if (!found)
									return;
		
						}
		
					// Otherwise, see if requested item is allowed.
						else {
		
							// Check index.
		
								// Less than zero? Jump to end.
									if (index < 0)
										index = _this.$links.length - 1;
		
								// Greater than length? Jump to beginning.
									else if (index >= _this.$links.length)
										index = 0;
		
								// Already there? Bail.
									if (index == _this.current)
										return;
		
							// Get item.
								item = _this.$links.item(index);
		
								if (!item)
									return;
		
							// Ignored? Bail.
								if (item.dataset.lightboxIgnore == '1')
									return;
		
						}
		
					// Mobile? Set zoom handler interval.
						if (client.mobile)
							_this.zoomIntervalId = setInterval(function() {
								_this.zoomHandler();
							}, 250);
		
					// Lock.
						_this.locked = true;
		
					// Current?
						if (_this.current !== null) {
		
							// Clear loaded.
								$modal.classList.remove('loaded');
		
							// Set switching.
								$modal.classList.add('switching');
		
							// Apply direction modifier (if applicable).
								switch (direction) {
		
									case -1:
										$modal.classList.add('from-left');
										break;
		
									case 1:
										$modal.classList.add('from-right');
										break;
		
									default:
										break;
		
								}
		
							// Delay (wait for switching transition).
								setTimeout(function() {
		
									// Set current, src.
										_this.current = index;
										$modalImage.src = item.href;
		
									// Delay.
										setTimeout(function() {
		
											// Focus.
												$modal.focus();
		
											// Unlock.
												_this.locked = false;
		
										}, _this.delay);
		
								}, _this.delay);
		
						}
		
					// Otherwise ...
						else {
		
							// Set current, src.
								_this.current = index;
								$modalImage.src = item.href;
		
							// Set visible.
								$modal.classList.add('visible');
		
							// Delay.
								setTimeout(function() {
		
									// Focus.
										$modal.focus();
		
									// Unlock.
										_this.locked = false;
		
								}, _this.delay);
		
						}
		
				};
		
				$modal.hide = function() {
		
					// Locked? Bail.
						if (_this.locked)
							return;
		
					// Already hidden? Bail.
						if (!$modal.classList.contains('visible'))
							return;
		
					// Lock.
						_this.locked = true;
		
					// Clear visible, loaded, switching.
						$modal.classList.remove('visible');
						$modal.classList.remove('loaded');
						$modal.classList.remove('switching', 'from-left', 'from-right', 'done');
		
					// Clear zoom handler interval.
						clearInterval(_this.zoomIntervalId);
		
					// Delay (wait for visible transition).
						setTimeout(function() {
		
							// Clear src.
								$modalImage.src = '';
		
							// Unlock.
								_this.locked = false;
		
							// Focus.
								$body.focus();
		
							// Clear current.
								_this.current = null;
		
						}, _this.delay);
		
				};
		
				$modal.next = function(direction) {
					$modal.show(null, 1, direction);
				};
		
				$modal.previous = function(direction) {
					$modal.show(null, -1, direction);
				};
		
				$modal.first = function() {
					$modal.show(0);
				};
		
				$modal.last = function() {
					$modal.show(_this.$links.length - 1);
				};
		
			// Events.
				$modalInner.addEventListener('touchstart', function(event) {
		
					// Navigation disabled? Bail.
						if (!_this.navigation)
							return;
		
					// More than two touches? Bail.
						if (event.touches.length > 1)
							return;
		
					// Record drag start.
						dragStart = {
							x: event.touches[0].clientX,
							y: event.touches[0].clientY
						};
		
				});
		
				$modalInner.addEventListener('touchmove', function(event) {
		
					var dx, dy;
		
					// Navigation disabled? Bail.
						if (!_this.navigation)
							return;
		
					// No drag start, or more than two touches? Bail.
						if (!dragStart
						||	event.touches.length > 1)
							return;
		
					// Record drag end.
						dragEnd = {
							x: event.touches[0].clientX,
							y: event.touches[0].clientY
						};
		
					// Determine deltas.
						dx = dragStart.x - dragEnd.x;
						dy = dragStart.y - dragEnd.y;
		
					// Doesn't exceed threshold? Bail.
						if (Math.abs(dx) < 50)
							return;
		
					// Prevent default.
						event.preventDefault();
		
					// Positive value? Move to next.
						if (dx > 0)
							$modal.next(-1);
		
					// Negative value? Move to previous.
						else if (dx < 0)
							$modal.previous(1);
		
				});
		
				$modalInner.addEventListener('touchend', function(event) {
		
					// Navigation disabled? Bail.
						if (!_this.navigation)
							return;
		
					// Clear drag start, end.
						dragStart = null;
						dragEnd = null;
		
				});
		
				$modal.addEventListener('click', function(event) {
					$modal.hide();
				});
		
				$modal.addEventListener('keydown', function(event) {
		
					// Not visible? Bail.
						if (!$modal.classList.contains('visible'))
							return;
		
					switch (event.keyCode) {
		
						// Right arrow, Space.
							case 39:
							case 32:
		
								if (!_this.navigation)
									break;
		
								event.preventDefault();
								event.stopPropagation();
		
								$modal.next();
		
								break;
		
						// Left arrow.
							case 37:
		
								if (!_this.navigation)
									break;
		
								event.preventDefault();
								event.stopPropagation();
		
								$modal.previous();
		
								break;
		
						// Home.
							case 36:
		
								if (!_this.navigation)
									break;
		
								event.preventDefault();
								event.stopPropagation();
		
								$modal.first();
		
								break;
		
						// End.
							case 35:
		
								if (!_this.navigation)
									break;
		
								event.preventDefault();
								event.stopPropagation();
		
								$modal.last();
		
								break;
		
						// Escape.
							case 27:
		
								event.preventDefault();
								event.stopPropagation();
		
								$modal.hide();
		
								break;
		
					}
		
				});
		
				$modalNext.addEventListener('click', function(event) {
					$modal.next();
				});
		
				$modalPrevious.addEventListener('click', function(event) {
					$modal.previous();
				});
		
			// Set.
				this.$modal = $modal;
				this.$modalImage = $modalImage;
				this.$modalNext = $modalNext;
				this.$modalPrevious = $modalPrevious;
		
		};
		
		/**
		 * Show.
		 * @param {string} href Image href.
		 */
		lightboxGallery.prototype.show = function(href, config) {
		
			// Update config.
				this.$links = config.$links;
				this.navigation = config.navigation;
				this.mobile = config.mobile;
				this.mobileNavigation = config.mobileNavigation;
				this.protect = config.protect;
		
			// Navigation.
				if (this.navigation) {
		
					this.$modalNext.style.display = '';
					this.$modalPrevious.style.display = '';
		
					// Mobile navigation.
						if (client.mobile
						&&	!this.mobileNavigation) {
		
							this.$modalNext.style.display = 'none';
							this.$modalPrevious.style.display = 'none';
		
						}
		
				}
				else {
		
					this.$modalNext.style.display = 'none';
					this.$modalPrevious.style.display = 'none';
		
				}
		
			// Protect.
				if (this.protect) {
		
					this.$modalImage.style.WebkitTouchCallout = 'none';
					this.$modalImage.style.userSelect = 'none';
		
				}
				else {
		
					this.$modalImage.style.WebkitTouchCallout = '';
					this.$modalImage.style.userSelect = '';
		
				}
		
			// Mobile.
				if (client.mobile && !this.mobile)
					return;
		
			// Show modal.
				this.$modal.show(href);
		
		};
		
		/**
		 * Zoom handler.
		 */
		lightboxGallery.prototype.zoomHandler = function() {
		
			var threshold = window.matchMedia('(orientation: portrait)').matches ? 50 : 100;
		
			// Zoomed in? Set zooming.
				if (window.outerWidth > window.innerWidth + threshold)
					this.$modal.classList.add('zooming');
		
			// Otherwise, clear zooming.
				else
					this.$modal.classList.remove('zooming');
		
		};
		
		var _lightboxGallery = new lightboxGallery;
	
	// Gallery: gallery02.
		_lightboxGallery.init({
			id: 'gallery02',
			navigation: false,
			mobile: true,
			mobileNavigation: true,
		});
	
	// Gallery: gallery01.
		_lightboxGallery.init({
			id: 'gallery01',
			navigation: false,
			mobile: true,
			mobileNavigation: true,
		});

})();