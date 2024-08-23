/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   home3D.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/22 17:19:17 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/23 02:23:55 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three'
import { Screen } from './Screen.js'

const	scene			= new THREE.Scene();
const	renderer		= new THREE.WebGLRenderer({antialias: true});
const	camera			= new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);
const	ambiantLight	= new THREE.AmbientLight(0xffffff, 0.16);
const	screen			= new Screen(scene);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.getElementsByClassName('homeSection')[0].appendChild(renderer.domElement);
scene.background = new THREE.Color(0x020202)
camera.position.set(0, 2.5, -5);
console.log(camera.rotation);
camera.rotation.set(Math.PI + 0.2, 0, Math.PI);
scene.add(ambiantLight);


document.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

/***** FOR DEBUGGING PURPOSES *****/

document.addEventListener('keydown', (e) => {
	if (e.key === 'w')
		camera.position.z += 0.1;
	if (e.key === 's')
		camera.position.z -= 0.1;
	if (e.key === 'a')
		camera.position.x -= 0.1;
	if (e.key === 'd')
		camera.position.x += 0.1;
	if (e.key === 'q')
		camera.position.y += 0.1;
	if (e.key === 'e')
		camera.position.y -= 0.1;
	if (e.key === 'ArrowUp')
		camera.rotation.x += 0.1;
	if (e.key === 'ArrowDown')
		camera.rotation.x -= 0.1;
	if (e.key === 'ArrowLeft')
		camera.rotation.y += 0.1;
	if (e.key === 'ArrowRight')
		camera.rotation.y -= 0.1;
	if (e.key === 'p')
	{
		console.log(camera.position);
		console.log(camera.rotation);
	}

});

/**********************************/


function home3D()
{
	createPlane();
	renderer.setAnimationLoop(loop)
}

function createPlane()
{
	const	geometry	= new THREE.PlaneGeometry(500, 500);
	const	material	= new THREE.MeshPhysicalMaterial({side: THREE.DoubleSide, color: 0x020202});
	const	mesh		= new THREE.Mesh(geometry, material);

	mesh.position.set(0, 0, 0);
	mesh.rotateX(-(Math.PI / 2));
	mesh.receiveShadow = true;
	scene.add(mesh);
}


function loop()
{
	renderer.render(scene, camera);
}


export { home3D };