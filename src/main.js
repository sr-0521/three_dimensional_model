import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0xffffff)); 

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)

// Replace the lights section with this
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Brighter ambient
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

// Add a point light for glow
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(-10, 0, 0);
scene.add(pointLight);

const loader = new GLTFLoader();
let earth;
loader.load(
    './earth.glb', // Replace with the path to your shiba model
    function (gltf) {
        earth = gltf.scene;
        earth.scale.set(10, 10, 10);
        scene.add(earth);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

camera.position.z = 5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onDocumentMouseDown(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
      const jumpHeight = 1.5;
      const jumpDuration = 0.4;
      gsap.to(earth.position, { y: jumpHeight, duration: jumpDuration, yoyo: true, repeat: 1, ease: "power1.inOut" });
  }
}

document.addEventListener('mousedown', onDocumentMouseDown, false);


function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls with damping
  renderer.render(scene, camera);
}

animate();