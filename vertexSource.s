    attribute vec2 coordinates;
    uniform vec2 u_resolution;
    void main() {
		vec2 zeroToOne = coordinates / u_resolution;
		vec2 zeroToTwo = zeroToOne * 2.0;
		vec2 clipSpace = zeroToTwo - 1.;
        gl_PointSize = .points..;
        zeroToTwo =clipSpace * vec2(1, -1);// f(x) = f(-x)
        zeroToTwo.x += (.points.. / u_resolution.x);
        zeroToTwo.y -= ( .points.. / u_resolution.y);
		gl_Position = vec4(zeroToTwo, 0, 1);
	}