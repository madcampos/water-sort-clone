/**
 * @typedef {'xbox' | 'dualshock' | 'joycon-l' | 'joycon-r' | 'joycon-lr' | 'unknown'} GamepadTypes
 */

/**
 * @typedef {'a' | 'b' | 'down' | 'left' | 'leftBumper' | 'leftStick' | 'leftTrigger' | 'logo' | 'right' | 'rightBumper' | 'rightStick' | 'rightTrigger' | 'select' | 'share' | 'start' | 'up' | 'x' | 'y'} ButtonNames
 */

/**
 * @typedef {Object} GamepadButtonEventDetail
 * @prop {ButtonNames} button
 */

/**
 * @typedef {Object} GamepadStickEventDetail
 * @prop {'left' | 'right'} stick
 * @prop {'left' | 'right'} [directionX]
 * @prop {'down' | 'up'} [directionY]
 * @prop {number} deltaX
 * @prop {number} deltaY
 */

/**
 * @typedef {Object} GamepadStickActionEventDetail
 * @prop {'left' | 'right'} stick
 * @prop {'left' | 'right'} [directionX]
 * @prop {'down' | 'up'} [directionY]
 */

export class GamepadHandler extends EventTarget {
	/** @type {Record<ButtonNames, boolean>} */
	static #buttonsPressed = {
		a: false,
		b: false,
		x: false,
		y: false,
		leftBumper: false,
		rightBumper: false,
		leftTrigger: false,
		rightTrigger: false,
		select: false,
		start: false,
		leftStick: false,
		rightStick: false,
		up: false,
		down: false,
		left: false,
		right: false,
		logo: false,
		share: false
	};

	static #DETECTION_THROTTLE_LIMIT = 100;
	static #detectionTimestamp = 0;
	static #THUMB_ACTION_THROTTLE_LIMIT = 120;
	static #thumbActionTimestamp = 0;
	static #DEADZONE_THRESHOLD = 0.2;
	static #ACTION_THRESHOLD = 0.55;

	static #ACTIVATION_TIME = 300;
	static #ACTIVATION_WEAK_VIBRATE = 0.8;
	static #ACTIVATION_STRONG_VIBRATE = 0.2;

	/** @type {GamepadTypes} */
	static #gamepadType = 'unknown';

	static #isGamepadConnected = false;

	/**
	 * @param {() => void} [callback]
	 */
	static init(callback) {
		window.addEventListener('gamepadconnected', () => {
			console.info('[🎮] Gamepad connected.');

			GamepadHandler.#detectionTimestamp = performance.now();
			GamepadHandler.#isGamepadConnected = true;

			GamepadHandler.#updateLoop();

			callback?.();
		});
	}

	/**
	 * @param {Gamepad} gamepad
	 */
	static #detectGamepadType(gamepad) {
		// Ref: https://github.com/BabylonJS/Babylon.js/blob/4b8b9c60c46695cdb57b074371c65a57b2bbf838/packages/dev/core/src/Gamepads/gamepadManager.ts#L170-L187

		const isDualshock = gamepad.id.includes('054c') && !gamepad.id.includes('0ce6');
		if (isDualshock) {
			this.#gamepadType = 'dualshock';
		}

		const isXbox = gamepad.id.includes('Xbox One') ||
			gamepad.id.includes('Xbox 360') ||
			gamepad.id.includes('xinput') ||
			(gamepad.id.includes('045e') && !gamepad.id.includes('Surface Dock'));
		if (isXbox) {
			this.#gamepadType = 'xbox';
		}

		const isJoyconL = gamepad.id.includes('057e') && gamepad.id.includes('2006');
		if (isJoyconL) {
			this.#gamepadType = 'joycon-l';
		}

		const isJoyconR = gamepad.id.includes('057e') && gamepad.id.includes('2007');
		if (isJoyconR) {
			this.#gamepadType = 'joycon-r';
		}

		const isJoyconLR = gamepad.id.includes('Joy-Con L+R');
		if (isJoyconLR) {
			this.#gamepadType = 'joycon-lr';
		}
	}

	static #updateLoop() {
		GamepadHandler.#triggerEvents();

		window.requestAnimationFrame(() => {
			GamepadHandler.#updateLoop();
		});
	}

	/**
	 * @param {'left' | 'right'} stick
	 * @param {number} x
	 * @param {number} y
	 */
	static #triggerStickEvents(stick, x, y) {
		window.dispatchEvent(
			new CustomEvent('gamepadstickmove', {
				bubbles: true,
				composed: true,
				cancelable: true,
				detail: /** @type {GamepadStickEventDetail} */ ({
					directionX: x > GamepadHandler.#DEADZONE_THRESHOLD ? 'right' : x < -GamepadHandler.#DEADZONE_THRESHOLD ? 'left' : undefined,
					directionY: y > GamepadHandler.#DEADZONE_THRESHOLD ? 'down' : y < -GamepadHandler.#DEADZONE_THRESHOLD ? 'up' : undefined,
					deltaX: x,
					deltaY: y,
					stick
				})
			})
		);
	}

	/**
	 * @param {'left' | 'right'} stick
	 * @param {number} x
	 * @param {number} y
	 */
	static #triggerStickAction(stick, x, y) {
		window.dispatchEvent(
			new CustomEvent('gamepadstickaction', {
				bubbles: true,
				composed: true,
				cancelable: true,
				detail: /** @type {GamepadStickActionEventDetail} */ ({
					directionX: x > GamepadHandler.#ACTION_THRESHOLD ? 'right' : x < -GamepadHandler.#ACTION_THRESHOLD ? 'left' : undefined,
					directionY: y > GamepadHandler.#ACTION_THRESHOLD ? 'down' : y < -GamepadHandler.#ACTION_THRESHOLD ? 'up' : undefined,
					stick
				})
			})
		);
	}

	/**
	 * @param {ButtonNames} buttonName
	 * @param {boolean} isButtonDown
	 */
	static #triggerButtonEvents(buttonName, isButtonDown) {
		const wasButtonDown = GamepadHandler.#buttonsPressed[buttonName];

		if (isButtonDown) {
			GamepadHandler.#buttonsPressed[buttonName] = true;

			window.dispatchEvent(
				new CustomEvent('gamepadbuttondown', {
					bubbles: true,
					composed: true,
					cancelable: true,
					detail: /** @type {GamepadButtonEventDetail} */ ({ button: buttonName })
				})
			);
		}

		if (wasButtonDown && !isButtonDown) {
			GamepadHandler.#buttonsPressed[buttonName] = false;

			window.dispatchEvent(
				new CustomEvent('gamepadbuttonup', {
					bubbles: true,
					composed: true,
					cancelable: true,
					detail: /** @type {GamepadButtonEventDetail} */ ({ button: buttonName })
				})
			);

			window.dispatchEvent(
				new CustomEvent('gamepadbuttonpress', {
					bubbles: true,
					composed: true,
					cancelable: true,
					detail: /** @type {GamepadButtonEventDetail} */ ({ button: buttonName })
				})
			);
		}
	}

	static #triggerEvents() {
		const [gamepad] = [...navigator.getGamepads()].filter((gamepad) => !gamepad?.id?.includes('Surface Dock'));

		if (!gamepad) {
			GamepadHandler.#isGamepadConnected = false;
			return;
		}

		const currentTimestamp = performance.now();
		if (currentTimestamp - GamepadHandler.#detectionTimestamp > GamepadHandler.#DETECTION_THROTTLE_LIMIT) {
			GamepadHandler.#detectionTimestamp = currentTimestamp;
			GamepadHandler.#isGamepadConnected = true;

			GamepadHandler.#detectGamepadType(gamepad);

			const [leftX = 0, leftY = 0, rightX = 0, rightY = 0] = gamepad.axes;

			GamepadHandler.#triggerStickEvents('left', leftX, leftY);
			GamepadHandler.#triggerStickEvents('right', rightX, rightY);

			(/** @type {ButtonNames[]} */ (Object.keys(GamepadHandler.#buttonsPressed))).forEach((buttonName, i) => {
				const isButtonDown = gamepad.buttons[i]?.pressed ?? false;

				GamepadHandler.#triggerButtonEvents(buttonName, isButtonDown);
			});
		}

		if (currentTimestamp - GamepadHandler.#thumbActionTimestamp > GamepadHandler.#THUMB_ACTION_THROTTLE_LIMIT) {
			GamepadHandler.#thumbActionTimestamp = currentTimestamp;
			GamepadHandler.#isGamepadConnected = true;

			GamepadHandler.#detectGamepadType(gamepad);
			const [leftX = 0, leftY = 0, rightX = 0, rightY = 0] = gamepad.axes;

			GamepadHandler.#triggerStickAction('left', leftX, leftY);
			GamepadHandler.#triggerStickAction('right', rightX, rightY);
		}
	}

	static get gamepadType() {
		return GamepadHandler.#gamepadType;
	}

	static get isGamepadConnected() {
		return GamepadHandler.#isGamepadConnected;
	}

	static vibrate(time = 100, weakIntensity = 0.4, strongIntentisy = 0) {
		const [gamepad] = navigator.getGamepads();

		void gamepad?.vibrationActuator?.playEffect('dual-rumble', {
			startDelay: 0,
			duration: time,
			weakMagnitude: weakIntensity,
			strongMagnitude: strongIntentisy
		});
	}

	static shortVibration() {
		GamepadHandler.vibrate();
	}

	static longVibration() {
		GamepadHandler.vibrate(GamepadHandler.#ACTIVATION_TIME, GamepadHandler.#ACTIVATION_WEAK_VIBRATE, GamepadHandler.#ACTIVATION_STRONG_VIBRATE);
	}
}
