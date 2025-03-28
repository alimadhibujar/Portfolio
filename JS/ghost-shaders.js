// Define shader code as strings
const vertexShaderSource = `
  precision mediump float;
  varying vec2 vUv;
  attribute vec2 a_position;
  void main() {
    vUv = 0.5 * (a_position + 1.0);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform float u_size;
  uniform vec2 u_pointer;
  uniform float u_smile;
  uniform vec2 u_target_pointer;
  uniform vec3 u_main_color;
  uniform vec3 u_border_color;
  uniform float u_flat_color;
  uniform sampler2D u_texture;

  #define TWO_PI 6.28318530718
  #define PI 3.14159265358979323846

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  vec2 rotate(vec2 v, float angle) {
    float r_sin = sin(angle);
    float r_cos = cos(angle);
    return vec2(v.x * r_cos - v.y * r_sin, v.x * r_sin + v.y * r_cos);
  }
  float eyes(vec2 uv) {
    uv.y -= 0.5;
    uv.x *= 1.0;
    uv.y *= 0.8;
    uv.x = abs(uv.x);
    uv.y += u_smile * 0.3 * pow(uv.x, 1.3);
    uv.x -= (0.6 + 0.2 * u_smile);
    float d = clamp(length(uv), 0.0, 1.0);
    return 1.0 - pow(d, 0.08);
  }
  float mouth(vec2 uv) {
    uv.y += 1.5;
    uv.x *= (0.5 + 0.5 * abs(1.0 - u_smile));
    uv.y *= (3.0 - 2.0 * abs(1.0 - u_smile));
    uv.y -= u_smile * 4.0 * pow(uv.x, 2.0);
    float d = clamp(length(uv), 0.0, 1.0);
    return 1.0 - pow(d, 0.07);
  }
  float face(vec2 uv, float rotation) {
    uv = rotate(uv, rotation);
    uv /= (0.27 * u_size);
    float eyes_shape = 10.0 * eyes(uv);
    float mouth_shape = 20.0 * mouth(uv);
    float col = 0.0;
    col = mix(col, 1.0, eyes_shape);
    col = mix(col, 1.0, mouth_shape);
    return col;
  }
  void main() {
    vec2 point = u_pointer;
    point.x *= u_ratio;
    vec2 uv = vUv;
    uv.x *= u_ratio;
    uv -= point;
    float texture = texture2D(u_texture, vec2(vUv.x, 1.0 - vUv.y)).r;
    float shape = texture;
    float noise = snoise(uv * vec2(0.7 / u_size, 0.6 / u_size) + vec2(0.0, 0.0015 * u_time));
    noise += 1.2;
    noise *= 2.1;
    noise += smoothstep(-0.8, -0.2, (uv.y) / u_size);
    float face = face(uv, 5.0 * (u_target_pointer.x - u_pointer.x));
    shape -= face;
    shape *= noise;
    vec3 border = (1.0 - u_border_color);
    border.g += 0.2 * sin(0.005 * u_time);
    border *= 0.5;
    vec3 color = u_main_color;
    color -= (1.0 - u_flat_color) * border * smoothstep(0.0, 0.01, shape);
    shape = u_flat_color * smoothstep(0.8, 1.0, shape) + (1.0 - u_flat_color) * shape;
    color *= shape;
    gl_FragColor = vec4(color, shape);
  }
`;

// Export the shader sources for use in  ghost-cursor.js file
export { vertexShaderSource, fragmentShaderSource };
