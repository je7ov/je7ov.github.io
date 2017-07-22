class squareObj {
	constructor({r, g, b}) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = 0.5;
		this.borderOffset = 50;
	}

	get color() {
		return `rgb(${this.r}, ${this.g}, ${this.b})`;
	}

	get borderColor() {
		const rgb = this.calcBorderColor();

		return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
	}

	get borderColorRaw() {
		return this.calcBorderColor();
	}

	calcBorderColor() {
		let borderR, borderG, borderB, dir;
		if (this.r + this.g + this.b < 125) {
			dir = 1;
		} else {
			dir = -1;
		}

		borderR = this.r + this.borderOffset * dir;
		borderG = this.g + this.borderOffset * dir;
		borderB = this.b + this.borderOffset * dir;

		if (borderR > 255) borderR = 255;
		else if (borderR < 0) borderR = 0;
		if (borderG > 255) borderG = 255;
		else if (borderG < 0) borderG = 0;
		if (borderB > 255) borderB = 255;
		else if (borderB < 0) borderB = 0;

		return {r: borderR, g: borderG, b: borderB};
	}
}
