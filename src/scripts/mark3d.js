// The 3D mark: the logo extruded into a block of dark metal, with the accent as light inside the cut between C and P.
// Loaded on demand by entrance.js; the flat SVG mark stays in place wherever this cannot run.
import {
  ACESFilmicToneMapping, BoxGeometry, Color, DirectionalLight, ExtrudeGeometry, Group, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, Path, PerspectiveCamera, PMREMGenerator, PointLight,
  Scene, Shape, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { C, P, P_HOLE, HEX } from '../lib/mark.js';

const DEPTH = 0.26; // block thickness, in mark heights
const BEVEL = 0.005;
const REST = { x: 0.2, y: -0.56 }; // the resting three-quarter view, in radians
const LAMP = 0.5;

// Logo units -> a mark one unit tall, centred, y up.
const point = ([x, y]) => [x / HEX.h, (HEX.h / 2 - y) / HEX.h];
const trace = (path, pts) => {
  pts.map(point).forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
  path.closePath();
  return path;
};

export function mount(stage, pose) {
  const accent = new Color(getComputedStyle(stage).getPropertyValue('--accent').trim());

  const renderer = new WebGLRenderer({ antialias: true, alpha: true }); // throws without WebGL; the caller keeps the flat mark
  // Without a graphics card the browser draws WebGL on the CPU, which stalls the whole page: keep the flat mark there.
  const gl = renderer.getContext();
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  if (info && /swiftshader|llvmpipe|software|basic render/i.test(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))) {
    renderer.dispose();
    throw new Error('software WebGL');
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, matchMedia('(pointer: coarse)').matches ? 1.5 : 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  stage.append(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; // procedural studio: no image to download
  pmrem.dispose();

  const camera = new PerspectiveCamera(24, 1, 0.1, 20);

  // Faces stay close to the logo's flat charcoal when seen head on; the walls carry the reflections and the light.
  const face = new MeshStandardMaterial({ color: 0x262626, metalness: 0.55, roughness: 0.6, envMapIntensity: 0.3 });
  const wall = new MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.7, roughness: 0.38 });
  const extrude = { depth: DEPTH, bevelEnabled: true, bevelThickness: BEVEL, bevelSize: BEVEL, bevelOffset: -BEVEL, bevelSegments: 2 };
  const block = (pts, hole) => {
    const shape = trace(new Shape(), pts);
    if (hole) shape.holes.push(trace(new Path(), hole));
    const geometry = new ExtrudeGeometry(shape, extrude);
    geometry.translate(0, 0, -DEPTH / 2);
    return new Mesh(geometry, [face, wall]);
  };

  // The light lives in the cut: a glowing strip plus lamps that tint the walls facing it.
  const cut = 41 / HEX.h;
  const glow = new Mesh(new BoxGeometry(cut * 0.3, 0.86, DEPTH * 0.5), new MeshBasicMaterial({ color: accent, toneMapped: false }));
  glow.position.z = -DEPTH * 0.1;
  const lamps = [0.3, 0, -0.3].map((y) => {
    const lamp = new PointLight(accent, 0, 0.6, 2);
    lamp.position.set(0, y, 0);
    return lamp;
  });

  const mark = new Group();
  mark.add(block(C), block(P, P_HOLE), glow, ...lamps);
  const key = new DirectionalLight(0xffffff, 1.2);
  key.position.set(-2, 3, 4);
  scene.add(mark, key);

  const fit = () => {
    const w = stage.clientWidth, h = stage.clientHeight; // layout size: unaffected by the entrance's transform
    if (!w || !h) return;
    const fill = parseFloat(getComputedStyle(stage).getPropertyValue('--mark-fill'));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Head on, the front face fills the same share of the stage as the flat SVG mark.
    camera.position.z = 1 / (2 * fill * Math.tan((camera.fov * Math.PI) / 360)) + DEPTH / 2;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(fit).observe(stage);
  fit();

  const aim = { x: 0, y: 0 }, lag = { x: 0, y: 0 };
  if (matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', (e) => {
      aim.x = e.clientX / innerWidth - 0.5;
      aim.y = e.clientY / innerHeight - 0.5;
    }, { passive: true });
  }

  // Stop drawing while its section is scrolled away. The section is the trigger, not the stage,
  // because the entrance moves the hero stage with transforms.
  gsap.registerPlugin(ScrollTrigger);
  let onScreen = true;
  ScrollTrigger.create({
    trigger: stage.closest('section, footer'),
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (onScreen = self.isActive),
  });
  const draw = (time) => {
    if (!onScreen) return;
    // Same lag at 60 and 120 Hz. deltaRatio is NaN until the ticker's first tick (a tab opened in the background).
    const k = 1 - Math.pow(0.94, gsap.ticker.deltaRatio() || 1);
    lag.x += (aim.x - lag.x) * k;
    lag.y += (aim.y - lag.y) * k;
    // turn 0 is the flat logo seen head on; the pointer and the idle drift only act once it has turned.
    mark.rotation.y = pose.turn * (REST.y + lag.x * 0.3 + Math.sin(time * 0.35) * 0.03) + (pose.spin || 0) * time; // spin: the footer's slow turn
    mark.rotation.x = pose.turn * (REST.x + lag.y * 0.16 + Math.cos(time * 0.28) * 0.015);
    glow.visible = pose.light > 0;
    glow.scale.y = Math.max(pose.light, 0.001);
    lamps.forEach((lamp) => (lamp.intensity = LAMP * pose.light));
    renderer.render(scene, camera);
  };
  gsap.ticker.add(draw); // one clock: the same ticker runs the entrance
  draw(0);
  stage.classList.add('is-3d');
}
