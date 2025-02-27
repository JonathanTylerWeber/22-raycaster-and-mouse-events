import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirecion = new THREE.Vector3(10, 0, 0);
// // normalize sets length to 1, 10 is arbitrary just to get direction
// rayDirecion.normalize();

// raycaster.set(rayOrigin, rayDirecion);

// object1.updateMatrixWorld();
// object2.updateMatrixWorld();
// object3.updateMatrixWorld();

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// **
// Mouse
// */
const mouse = new THREE.Vector2();

mouse.x = -100;
mouse.y = -100;

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;

  //   console.log("mouse", mouse);
});

window.addEventListener("click", () => {
  //   console.log("click");
  if (currentIntersect) {
    if (currentIntersect.object === object1) {
      console.log("click obj 1");
    } else if (currentIntersect.object === object2) {
      console.log("click obj 2");
    } else if (currentIntersect.object === object3) {
      console.log("click obj 3");
    }
  }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Model
 */
const gltfLoader = new GLTFLoader();

let model = null;

gltfLoader.load("./models/Duck/glTF-Binary/Duck.glb", (gltf) => {
  // console.log("loaded");
  model = gltf.scene;
  model.position.y = -1;
  scene.add(model);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#ffffff", 0.9);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 2.1);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   animate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  //**** */
  //   cast ray
  raycaster.setFromCamera(mouse, camera);

  // intersect with model
  if (model) {
    const modelIntersects = raycaster.intersectObject(model);
    // console.log(modelIntersects);
    if (modelIntersects.length) {
      model.scale.set(1.2, 1.2, 1.2);
    } else {
      model.scale.set(1, 1, 1);
    }
  }

  // const objectsToTest = [object1, object2, object3];
  // const intersects = raycaster.intersectObjects(objectsToTest);

  // for (const object of objectsToTest) {
  //   object.material.color.set("#ff0000");
  // }

  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("#0000ff");
  // }

  // if (intersects.length) {
  //   if (currentIntersect === null) {
  //     console.log("mouse enter");
  //   }
  //   currentIntersect = intersects[0];
  // } else {
  //   if (currentIntersect) {
  //     console.log("mouse leave");
  //   }
  //   currentIntersect = null;
  // }

  //
  //   const rayOrigin = new THREE.Vector3(-3, 0, 0);
  //   const rayDirecion = new THREE.Vector3(1, 0, 0);
  //   rayDirecion.normalize();

  //   raycaster.set(rayOrigin, rayDirecion);

  //   const objectsToTest = [object1, object2, object3];
  //   const intersects = raycaster.intersectObjects(objectsToTest);
  //   //   console.log(intersects.length);

  //   for (const object of objectsToTest) {
  //     object.material.color.set("#ff0000");
  //   }

  //   for (const intersect of intersects) {
  //     intersect.object.material.color.set("#0000ff");
  //   }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
