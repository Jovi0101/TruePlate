import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// GLTFExporter's binary path reads a Blob via FileReader.readAsArrayBuffer.
// Node has no FileReader; polyfill just enough of it using the global Blob.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

const THREE = await import('three');
const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../shared/templates.json'), 'utf8'));

function angleForIndex(i, n) {
  const deg = 90 - i * (360 / n);
  return (deg * Math.PI) / 180;
}

function positionForRole(i, n) {
  const a = angleForIndex(i, n);
  return { x: data.placementRadius * Math.cos(a), z: -data.placementRadius * Math.sin(a) };
}

function buildShape(role) {
  const r = data.roles[role];
  let geo;
  switch (r.shape) {
    case 'box':
      geo = new THREE.BoxGeometry(r.size[0], r.size[1], r.size[2]);
      break;
    case 'dome':
      geo = new THREE.SphereGeometry(r.radius, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      break;
    case 'torus':
      geo = new THREE.TorusGeometry(r.radius, r.tube, 12, 28);
      break;
    case 'dollop':
      geo = new THREE.SphereGeometry(r.radius, 20, 14);
      break;
    default:
      throw new Error('unknown shape ' + r.shape);
  }
  const mat = new THREE.MeshStandardMaterial({ color: r.color, roughness: 0.75, metalness: 0.03 });
  const mesh = new THREE.Mesh(geo, mat);
  if (r.shape === 'torus') mesh.rotation.x = Math.PI / 2;
  if (r.shape === 'dollop' && r.squashY) mesh.scale.y = r.squashY;
  return mesh;
}

function buildPlate() {
  const p = data.plate;
  const geo = new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p.height, 48);
  const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.55, metalness: 0.05 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'plate';
  mesh.position.y = p.height / 2;
  return mesh;
}

function exportGLB(scene, outPath) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (result) => {
        const buffer = Buffer.from(result);
        fs.writeFileSync(outPath, buffer);
        resolve(buffer.length);
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

const outDir = path.join(__dirname, 'out');
fs.mkdirSync(outDir, { recursive: true });

const hotspotManifest = {};

for (const tpl of data.templates) {
  const scene = new THREE.Scene();
  scene.add(buildPlate());

  const n = tpl.parts.length;
  const hotspots = [];
  tpl.parts.forEach((role, i) => {
    const { x, z } = positionForRole(i, n);
    const r = data.roles[role];
    const mesh = buildShape(role);
    mesh.name = 'part_' + role;
    mesh.position.set(x, r.centerY, z);
    scene.add(mesh);
    hotspots.push({ role, label: r.defaultLabel, position: [Number(x.toFixed(4)), r.hotspotY, Number(z.toFixed(4))] });
  });

  const outPath = path.join(outDir, tpl.id + '.glb');
  const size = await exportGLB(scene, outPath);
  hotspotManifest[tpl.id] = { label: tpl.label, parts: hotspots };
  console.log(tpl.id, '->', size, 'bytes');
}

fs.writeFileSync(path.join(outDir, 'hotspots.json'), JSON.stringify(hotspotManifest, null, 2));
console.log('wrote hotspots.json');
