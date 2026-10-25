//import * as thr from 'https://unpkg.com/three/build/three.module.js'
//import {GLTFLoader} from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js'

// main 

import * as thr from 'three';
import { AnaglyphEffect, DragControls, GLTFLoader } from 'three/examples/jsm/Addons.js';

// Graphics

import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Camera controls

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

// Animations

import gsap from 'gsap';

// HTML -----------------------------------------

const canvas = document.getElementById('mcanvas');

const rect = canvas.getBoundingClientRect();
const cwidht = rect.width;
const cheight = rect.height;

// ----------------------------------------------

// Scene ----------------------------------------

const scene = new thr.Scene()

const cam = new thr.PerspectiveCamera(
    75,
    cwidht / cheight,
    0.1,
    1000
)

const renderer = new thr.WebGLRenderer();
renderer.setSize(cwidht, cheight);

document.body.appendChild(renderer.domElement);

cam.position.z = 5;
cam.position.y = 5;

// ----------------------------------------------

// CamControls ----------------------------------

const controls = new OrbitControls(cam, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false
controls.minDistance = 2;
controls.maxDistance = 10;

// ----------------------------------------------

// Graphics -------------------------------------

const renderScene = new RenderPass(scene, cam);
const composer = new EffectComposer(renderer);

composer.addPass(renderScene);

const bloomPass= new UnrealBloomPass(
    new thr.Vector2(cwidht, cheight),
    1.25,
    0.525,
    0.525
)

composer.addPass(bloomPass)

// ----------------------------------------------

// Light ----------------------------------------

const ambientlight = new thr.AmbientLight('white', 0.1);
const sunlight = new thr.PointLight('#f8e29b', 50, 500000);
const pointLight1 = new thr.PointLight('#fff78e', 50, 500);

pointLight1.position.y = 8
sunlight.position.set(0, 0, 0)

//scene.add(pointLight1)
scene.add(ambientlight);
scene.add(sunlight);

// ----------------------------------------------



const geo = new thr.SphereGeometry(0.5, 32, 32)
const mat = new thr.MeshBasicMaterial({color: 'red'})
const cube = new thr.Mesh(geo, mat)

const geo2 = new thr.BoxGeometry()
const sphere = new thr.Mesh(geo2, mat)

sphere.name = "pis"


scene.add(cube)
scene.add(sphere)

sphere.position.x = 2


// Custom models --------------------------------

const loader = new GLTFLoader();
const texloader = new thr.TextureLoader();

// Sun

const sunMesh = new thr.Mesh(
    new thr.SphereGeometry(1, 16),
    new thr.MeshStandardMaterial({
        map: texloader.load('images/textures/SunColorMap.png'),
        emissive: new thr.Color('rgba(253, 204, 165)'),
        emissiveIntensity: 1.05,
        emissiveMap: texloader.load('images/textures/SunEmissionMap.png'),
    })
)

sunMesh.scale.set(3, 3, 3)

sunMesh.userData.baseScale = new thr.Vector3(sunMesh.scale.x, sunMesh.scale.y, sunMesh.scale.z)
sunMesh.userData.ToScale = new thr.Vector3(sunMesh.scale.x * 1.1, sunMesh.scale.y * 1.1, sunMesh.scale.z * 1.1,)
sunMesh.userData.touchable = true

scene.add(sunMesh)

// Mercury

const mercuryMesh = new thr.Mesh(
    new thr.SphereGeometry(1, 16),
    new thr.MeshStandardMaterial({
        map: texloader.load('images/textures/MercuryColorMap.png'),
        normalMap: texloader.load('images/textures/MercuryNormalMap.png')
    })
)

mercuryMesh.scale.set(0.25, 0.25, 0.25)

mercuryMesh.userData.baseScale = new thr.Vector3(mercuryMesh.scale.x, mercuryMesh.scale.y, mercuryMesh.scale.z)
mercuryMesh.userData.ToScale = new thr.Vector3(mercuryMesh.scale.x * 1.25, mercuryMesh.scale.y * 1.25, mercuryMesh.scale.z * 1.25,)

scene.add(mercuryMesh)

// Venus

const venusMesh = new thr.Mesh(
    new thr.SphereGeometry(1, 16),
    new thr.MeshStandardMaterial({
        map: texloader.load('images/textures/VenusColorMap.png'),
    })
)

venusMesh.scale.set(0.25, 0.25, 0.25)

venusMesh.userData.baseScale = new thr.Vector3(venusMesh.scale.x, venusMesh.scale.y, venusMesh.scale.z)
venusMesh.userData.ToScale = new thr.Vector3(venusMesh.scale.x * 1.5, venusMesh.scale.y * 1.5, venusMesh.scale.z * 1.5,)

scene.add(venusMesh)

let earth;

loader.load(
    'models/earth.glb',
    (gltf) => {
        earth = gltf.scene
        earth.scale.set(0.5, 0.5, 0.5)
        earth.position.set(0, 0, 0)
        scene.add(earth)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + "% load")
    },
    (error) => {
        console.error(error)
    }
    )


// ---------------------------------------------

// Models --------------------------------------

// Grid
const grid = new thr.GridHelper(50, 50);
grid.userData.isGrid = true
scene.add(grid);

// Orbit1
const geoOrbit1 = new MeshLineGeometry();
const matOrbit1 = new MeshLineMaterial({
    color: '#707070',
    lineWidth: 0.025
})

const geoPointsOrbit1 = [];
for (let t = 0; t <= 6.29 * 2; t+= 0.01) {
    const x = Math.cos(-t) * 5
    const z = Math.sin(-t) * 5
    geoPointsOrbit1.push(new thr.Vector3(x, 0, z))
}
geoOrbit1.setPoints(geoPointsOrbit1);

const Orbit1 = new thr.Mesh(geoOrbit1, matOrbit1)
scene.add(Orbit1)
// ---------------------------------------------

// Raycast for mousepicking ---------------------

let planets = [sphere];

const drag = new DragControls(planets, cam, renderer.domElement);

drag.addEventListener('dragstart', function(event) {
    controls.enabled = false
})

drag.addEventListener('dragend', function(event) {
    controls.enabled = true
})

// ----------------------------------------------

// Planet interaction ---------------------------
const mouse = new thr.Vector2()
const raycast = new thr.Raycaster()

let ishover = false

let selectedObjects = []
let touchable = [sunMesh, mercuryMesh, venusMesh]

window.addEventListener('mousemove', function(event){
    const cords = new thr.Vector2(
        (event.clientX / cwidht) * 2 - 1,
        - ((event.clientY / cheight) * 2 - 1)
    );
    raycast.setFromCamera(cords, cam);

    const intersects = raycast.intersectObjects(touchable);
    
    if (intersects.length > 0 && !ishover) {
        ishover = true
        selectedObjects.push(intersects[0].object)
        console.log(intersects)

        gsap.to(selectedObjects[0].scale, {x: selectedObjects[0].userData.ToScale.x, y: selectedObjects[0].userData.ToScale.y, z: selectedObjects[0].userData.ToScale.z, duration: 1, ease: 'power1.out'})
    } else if (intersects.length == 0 && ishover) {
        ishover = false
        console.log(intersects)

        gsap.to(selectedObjects[0].scale, {x: selectedObjects[0].userData.baseScale.x, y: selectedObjects[0].userData.baseScale.y, z: selectedObjects[0].userData.baseScale.z, duration: 0.75, ease: 'power1.out'})
        selectedObjects.shift()
    }
})

// ----------------------------------------------

//function resetScale() {
//    for (let i = 0; i < scene.children.length; i++) {
//        if (scene.children[i].scale && !ishover) {
//            gsap.to(scene.children[i].scale, {x: 1, y: 1, z: 1, duration: 1, ease: 'power1.out'})
//        }
//    }
//}


let angle = 0
let angle1 = 0

function animate() {
    requestAnimationFrame(animate)
    
    sunMesh.rotation.y += 0.005
    
    mercuryMesh.position.x = Math.cos(-angle) * 5
    mercuryMesh.position.z = Math.sin(-angle) * 5
    mercuryMesh.rotation.y += 0.1

    venusMesh.position.x = Math.cos(-angle1) * 8
    venusMesh.position.z = Math.sin(-angle1) * 8
    venusMesh.rotation.y += 0.1

    composer.render()
    //renderer.render(scene, cam)

    controls.update()
    angle += 0.01
    angle1 += 0.005
}

animate()

