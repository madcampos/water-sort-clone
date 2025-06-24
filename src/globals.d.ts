import type { ControllerBadge } from './components/ControllerBadge/index.ts';
import type { LiquidFlask } from './components/Flask/index.ts';
import type { FlaskStatus } from './components/FlaskStatus/index.ts';
import type { GameOverScreen } from './screen/GameOver/index.ts';
import type { HelpScreen } from './screen/Help/index.ts';
import type { LevelSelect } from './screen/LevelSelect/index.ts';
import type { MainScreen } from './screen/MainScreen/index.ts';
import type { SettingsScreen } from './screen/Settings/index.ts';
import type { TitleScreen } from './screen/Title/index.ts';

declare global {
	interface HTMLElementTagNameMap {
		// Components
		'controller-badge': ControllerBadge;
		'liquid-flask': LiquidFlask;
		'flask-status': FlaskStatus;

		// Screens
		'game-over-screen': GameOverScreen;
		'help-screen': HelpScreen;
		'level-select-screen': LevelSelect;
		'main-screen': MainScreen;
		'settings-screen': SettingsScreen;
		'title-screen': TitleScreen;
	}
}
