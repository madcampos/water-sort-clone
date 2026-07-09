import type { IconifyIconHTMLElement } from 'iconify-icon';
import 'iconify-icon';

import type { ControllerBadge } from './ControllerBadge/ControllerBadge.ts';
import type { LiquidFlask } from './Flask/Flask.ts';
import type { FlaskStatus } from './FlaskStatus/FlaskStatus.ts';

import './ControllerBadge/ControllerBadge.ts';
import './Flask/Flask.ts';
import './FlaskStatus/FlaskStatus.ts';

declare global {
	interface HTMLElementTagNameMap {
		'iconify-icon': IconifyIconHTMLElement;

		// #region HTML Only components
		'sr-only': HTMLElement;
		// #endregion

		// #region JS Components
		'controller-badge': ControllerBadge;
		'liquid-flask': LiquidFlask;
		'flask-status': FlaskStatus;
		// #endregion
	}
}
