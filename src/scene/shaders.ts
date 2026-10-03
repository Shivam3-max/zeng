// Ashima / Stefan Gustavson 3D simplex noise (MIT).
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

export const soulVertex = /* glsl */ `
uniform float uTime;
uniform float uW[9];
uniform float uSize;
uniform float uPR;
uniform float uTurb;
uniform float uBreath;
uniform float uLight;
uniform float uWarm;
uniform float uPulse;
uniform vec2 uMouse;
uniform float uAspect;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;

attribute vec3 aS1;
attribute vec3 aS2;
attribute vec3 aS3;
attribute vec3 aS4;
attribute vec3 aS5;
attribute vec3 aS6;
attribute vec3 aS7;
attribute vec3 aS8;
attribute vec4 aRand;

varying vec3 vColor;
varying float vAlpha;

${noise}

const vec3 CHAKRA[7] = vec3[7](
  vec3(0.93, 0.27, 0.32), vec3(0.98, 0.55, 0.25), vec3(0.98, 0.80, 0.30),
  vec3(0.35, 0.82, 0.58), vec3(0.30, 0.66, 0.92), vec3(0.47, 0.40, 0.88),
  vec3(0.76, 0.52, 0.95)
);

vec3 chakraColor(float y) {
  float k = clamp((y + 0.95) / 1.9, 0.0, 1.0) * 6.0;
  int i = int(floor(k));
  int j = min(i + 1, 6);
  return mix(CHAKRA[i], CHAKRA[j], smoothstep(0.35, 0.65, fract(k)));
}

void main() {
  vec3 p = position * uW[0] + aS1 * uW[1] + aS2 * uW[2] + aS3 * uW[3] + aS4 * uW[4]
         + aS5 * uW[5] + aS6 * uW[6] + aS7 * uW[7] + aS8 * uW[8];
  vec3 shape = p;

  // living drift — stronger while a form is dissolving into the next
  float t = uTime * 0.11;
  vec3 q = p * 1.6 + aRand.x * 6.0;
  vec3 n = vec3(snoise(q + t), snoise(q + vec3(17.1, 3.2, 9.7) + t), snoise(q + vec3(31.4, 27.8, 5.1) + t));
  p += n * (0.016 + uTurb * 0.32);
  // a pulse rolls outward as a wave through the form
  float wave = sin(length(shape) * 9.0 - uPulse * 14.0) * 0.5 + 0.5;
  p += normalize(p + vec3(1e-4)) * uPulse * (0.05 + 0.1 * wave) * (0.5 + aRand.y);
  p *= 1.0 + uBreath;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  // luminous limb: particles on the silhouette of the orb glow brighter
  vec4 cv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec3 rel = normalize(mv.xyz - cv.xyz + vec3(1e-5));
  float rim = 1.0 - abs(rel.z);
  float limb = mix(1.0, 0.4 + 1.25 * rim * rim, uW[0]);

  // the cursor parts the particles like a hand through mist
  vec2 ndc = gl_Position.xy / gl_Position.w;
  vec2 d = ndc - uMouse;
  d.x *= uAspect;
  float m = smoothstep(0.32, 0.0, length(d));
  vec2 push = normalize(d + 1e-5) * m * 0.07;
  push.x /= uAspect;
  gl_Position.xy += push * gl_Position.w;

  float sparkle = step(0.94, aRand.w);
  gl_PointSize = uSize * (0.45 + aRand.y * 0.95) * (1.0 + sparkle * 0.9) * mix(1.0, 0.8 + 0.45 * rim, uW[0]) * uPR * (10.0 / -mv.z);

  // colour: aurora bands → chakra rainbow → lotus blush → dawn-sun gold
  float band = 0.5 + 0.5 * sin(shape.y * 2.4 + shape.x * 1.2 + uTime * 0.9);
  float g = clamp(mix(aRand.z, band, 0.62), 0.0, 1.0);
  vec3 aura = g < 0.5 ? mix(uC0, uC1, g * 2.0) : mix(uC1, uC2, (g - 0.5) * 2.0);
  aura = mix(aura, uC3, sparkle);
  vec3 col = mix(aura, chakraColor(shape.y), uW[5]);
  vec3 lotus = mix(vec3(0.98, 0.6, 0.74), vec3(1.0, 0.86, 0.62), clamp((shape.y + 0.35) / 0.9, 0.0, 1.0));
  col = mix(col, lotus, uW[8] * 0.85);
  vec3 sun = mix(vec3(1.0, 0.66, 0.32), vec3(1.0, 0.9, 0.72), g);
  col = mix(col, sun, uWarm);

  // on the dawn (light) background the same particles read as ink and amber
  vec3 deep = mix(vec3(0.16, 0.12, 0.34), col * 0.55, 0.45);
  vec3 sunDeep = mix(vec3(0.86, 0.42, 0.14), vec3(0.93, 0.64, 0.28), g);
  col = mix(col, mix(deep, sunDeep, uWarm), uLight);

  vColor = col;
  vAlpha = (0.5 + aRand.y * 0.5) * mix(1.0, 0.62, uLight) * limb * (1.0 + uPulse * 0.8);
}
`

export const soulFragment = /* glsl */ `
uniform float uOpacity;
uniform float uLight;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = pow(smoothstep(0.5, 0.0, d), 1.7);
  float core = smoothstep(0.16, 0.0, d) * (1.0 - uLight);
  gl_FragColor = vec4(vColor + core * 0.4, a * vAlpha * uOpacity);
}
`

export const starVertex = /* glsl */ `
uniform float uTime;
uniform float uPR;
attribute float aSeed;
varying float vA;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.55 + 0.45 * sin(uTime * (0.4 + aSeed * 1.4) + aSeed * 40.0);
  vA = tw * (0.25 + aSeed * 0.75);
  gl_PointSize = (0.8 + aSeed * 1.9) * uPR;
}
`

export const starFragment = /* glsl */ `
uniform float uOpacity;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vec3(0.94, 0.91, 1.0), smoothstep(0.5, 0.0, d) * vA * uOpacity);
}
`
