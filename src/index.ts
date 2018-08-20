import * as THREE from 'three';

// initialise main objects
var scene = new THREE.Scene()
scene.background = new THREE.Color( 0xffffff )
scene.fog = new THREE.FogExp2( 0xCCCFFF, 0.002 )
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

camera.position.z = 80

camera.rotation.x = 25 * Math.PI / 180
camera.rotation.y = -20 * Math.PI / 180
camera.rotation.z = -30 * Math.PI / 180

const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )

// Attach the renderer to the document
document.body.appendChild( renderer.domElement )

// create a cube with a shitty material
var addCube = function( sizeX, sizeY, sizeZ, posX, posY, posZ ) {
	var geometry = new THREE.BoxGeometry( sizeX, sizeY, sizeZ )
	var material = new THREE.MeshPhongMaterial( { color: 'brown' } )
	var cubeMesh = new THREE.Mesh( geometry, material )
	cubeMesh.position.set(posX, posY, posZ)
	cubeMesh.receiveShadow = true
	cubeMesh.castShadow = true
	scene.add( cubeMesh );
}

for (let i = 0; i < 60; i++) {
	for (let j = 0; j < 60; j++) {
		const heightDiff = (Math.random() * 8) - 4
		addCube( 1, 1, 25 + heightDiff, i, j, 0 )		
	}
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.75)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.8, 200)
pointLight.position.set(70, 45, 50)
pointLight.castShadow = true
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 200
scene.add(pointLight)

var render = function() {
	renderer.render( scene, camera )
}

render()

// var animate = function() {
// 	requestAnimationFrame( animate );
// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;
// 	renderer.render( scene, camera );
// }
// animate();