import '../components/index.ts';
import '../screen/index.ts';

import { GamepadHandler } from './gamepad.ts';

document.addEventListener('DOMContentLoaded', () => {
	GamepadHandler.init();

	document.querySelector('title-screen')?.open();
});
