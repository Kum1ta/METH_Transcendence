/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   home3D.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/22 17:19:17 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/22 19:33:44 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';



const loader = new GLTFLoader();

const	scene			= new THREE.Scene();
const	renderer		= new THREE.WebGLRenderer({antialias: true});
const	camera			= new THREE.PerspectiveCamera(60, window.innerWidth / innerWidth);
const	ambiantLight	= new THREE.AmbientLight(0xffffff, 0.1);
const	spotLight		= new THREE.SpotLight(0xffffff, 100, 0, 0.5);
const	helper			= new THREE.SpotLightHelper(spotLight);


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
scene.add(helper);
document.body.getElementsByClassName('homeSection')[0].appendChild(renderer.domElement);
scene.background = new THREE.Color(0x325352)
camera.position.set(-10, 10, -10);
spotLight.position.set(-10, 10, -10);
spotLight.castShadow = true;
scene.add(spotLight);
helper.update();
scene.add(ambiantLight);
const controls = new OrbitControls(camera, renderer.domElement);

function home3D()
{
	createPlane();
	createBox();
	loader.load( './modeles/tv.glb', (gltf) => {
		const tv = gltf.scene.children[0];
		console.log(tv);
		tv.position.set(0, 0.68, 0);
		tv.material = new THREE.MeshPhysicalMaterial({color: 0x222222});
		tv.scale.set(0.1, 0.08, 0.12);
		tv.castShadow = true;
		tv.receiveShadow = true;
		scene.add(tv);
	}, undefined, function ( error ) {
		console.error( error );
	} );
	
	renderer.setAnimationLoop(loop)
}

function createPlane()
{
	const	geometry	= new THREE.PlaneGeometry(20, 20);
	const	material	= new THREE.MeshPhysicalMaterial({side: THREE.DoubleSide, color: 0xffffff});
	const	mesh		= new THREE.Mesh(geometry, material);

	mesh.position.set(0, 0, 0);
	mesh.rotateX(-(Math.PI / 2));
	mesh.receiveShadow = true;
	scene.add(mesh);
}

function createBox()
{
	const	geometry	= new THREE.BoxGeometry(1, 1, 1);
	const	material	= new THREE.MeshPhysicalMaterial({color: 0xffffff});
	const	mesh		= new THREE.Mesh(geometry, material);

	mesh.position.set(-3, 0.5, -3);
	mesh.receiveShadow = true;
	scene.add(mesh);
}


function loop()
{
	controls.update();
	renderer.render(scene, camera);
}

export { home3D };