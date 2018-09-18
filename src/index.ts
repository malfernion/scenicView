import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';
import TerrainGenerator from './services/TerrainGenerator'

let scene, camera, renderer, controls
const size = 65
let terrainGenerator = new TerrainGenerator()

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
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;

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
	scene.add(new THREE.AmbientLight(0xffffff, 0.4))
	
	const pointLight = new THREE.PointLight('white', 0.7, 0)
	pointLight.position.set(150, 150, 700)
	pointLight.shadow.camera.near = 0.1
	pointLight.shadow.camera.far = 1000
    pointLight.shadow.mapSize.width = 1024
	pointLight.shadow.mapSize.height = 1024
	pointLight.castShadow = true

	scene.add(pointLight)
}

// const mudMaterial = new THREE.MeshLambertMaterial({
// 	map: THREE.ImageUtils.loadTexture('/src/textures/mud_32px.png')
// })

// const grassMaterial = new THREE.MeshLambertMaterial({
// 	map: THREE.ImageUtils.loadTexture('/src/textures/grass_32px.png')
// })

// const materials = [ mudMaterial, mudMaterial, mudMaterial, mudMaterial, grassMaterial, mudMaterial ]

// create a cuboid
function addCube(posX, posY, height) {
	const geometry = new THREE.CubeGeometry(1, 1, height)
	const material = new THREE.MeshLambertMaterial({ color: 0x0aeedf })
	const cubeMesh = new THREE.Mesh(geometry, material)
	cubeMesh.position.set(posX, posY, 0 + height / 2)
	cubeMesh.receiveShadow = true
	cubeMesh.castShadow = true
	scene.add(cubeMesh);
}

// Add a plane as stylised water
function addWaterPlane() {
	const geometry = new THREE.PlaneGeometry( size, size, 32 );
	const material = new THREE.MeshBasicMaterial( {color: 0x005F50, side: THREE.DoubleSide} );
	const plane = new THREE.Mesh( geometry, material );
	plane.position.set(0, 0, 0)
	scene.add( plane );
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera)
}

init()
addLights()

const terrainConfig = {
	size: size,
	type: 'fractal'
}

terrainGenerator.generate(terrainConfig)
	.then(terrain => {
		addWaterPlane()
		for (let innerArray of terrain) {
			for (let terrainObject of innerArray) {
				if(terrainObject.height > 0) {
					addCube(terrainObject.posX, terrainObject.posY, terrainObject.height)
				}
			}
		}
		animate()
	})