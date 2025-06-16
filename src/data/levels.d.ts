export type LiquidColor = 'BLUE' | 'GREEN' | 'ORANGE' | 'PURPLE' | 'RED' | 'YELLOW';

export type Flask = LiquidColor[];

export interface Level {
	name: string;
	flasks: Flask[];
	flaskSize: number;
}
