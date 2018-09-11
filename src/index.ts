import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';
import TerrainGenerator from './services/TerrainGenerator'

let scene, camera, renderer, controls
let terrainGenerator = new TerrainGenerator(20, 10, 65, 65)

// initialise main objects
function init() {
	// Create the scene and set the background
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xffffff)

	// Create and position the camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.set(30, 30, 80);
	camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// Create the renderer and add to the page
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)

	// Attach the renderer to the document
	document.body.appendChild(renderer.domElement)

	// Set the controls for the scene
	controls = new THREE.OrbitControls(camera, renderer.domElement)
	controls.minDistance = 10;
	controls.maxDistance = 500
	controls.maxPolarAngle = Math.PI / 2;
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
}

function addLights() {
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
	scene.add(ambientLight)
	
	const pointLight = new THREE.PointLight(0xffffff, 1.2, 200)
	pointLight.position.set(70, 45, 50)
	pointLight.castShadow = true
	pointLight.shadow.camera.near = 0.1
	pointLight.shadow.camera.far = 200
	scene.add(pointLight)
}

init()
addLights()

const mudMaterial = new THREE.MeshLambertMaterial({
	map: THREE.ImageUtils.loadTexture('/src/textures/mud_32px.png')
})

const grassMaterial = new THREE.MeshLambertMaterial({
	map: THREE.ImageUtils.loadTexture('/src/textures/grass_32px.png')
})

const materials = [ mudMaterial, mudMaterial, mudMaterial, mudMaterial, grassMaterial, mudMaterial ]

// create a cube with a shitty material
var addCube = function(posX, posY, height) {
	var geometry = new THREE.BoxGeometry(1, 1, height)
	var cubeMesh = new THREE.Mesh(geometry, materials)
	cubeMesh.position.set(posX, posY, 0 + height / 2)
	cubeMesh.receiveShadow = true
	cubeMesh.castShadow = true
	scene.add(cubeMesh);
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera)
}

terrainGenerator.generate()
	.then(terrain => {
		for (let innerArray of terrain) {
			for (let terrainObject of innerArray) {
				addCube(terrainObject.posX, terrainObject.posY, terrainObject.height)
			}
		}
		animate()
	})