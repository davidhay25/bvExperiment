import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

console.log(THREE)
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';

// Sample FHIR DAG data
const fhirData = [
  { id: 'Patient1', type: 'Patient', connections: ['Observation1', 'Encounter1'] },
  { id: 'Observation1', type: 'Observation', connections: [] },
  { id: 'Encounter1', type: 'Encounter', connections: ['Procedure1'] },
  { id: 'Procedure1', type: 'Procedure', connections: [] }
];

// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 10);
controls.update();

// D3 force simulation
const simulation = d3.forceSimulation(fhirData)
  .force('link', d3.forceLink().id(d => d.id).distance(3))
  .force('charge', d3.forceManyBody().strength(-5))
  .force('center', d3.forceCenter(0, 0));

// Create nodes and edges
const nodes = {};
fhirData.forEach((node, i) => {
  const geometry = new THREE.SphereGeometry(0.3, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(Math.random() * 5, Math.random() * 5, Math.random() * 5);
  scene.add(sphere);
  nodes[node.id] = sphere;
});

// Create edges
fhirData.forEach(node => {
  node.connections.forEach(targetId => {
    if (nodes[targetId]) {
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const geometry = new THREE.BufferGeometry().setFromPoints([
        nodes[node.id].position, nodes[targetId].position
      ]);
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    }
  });
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
