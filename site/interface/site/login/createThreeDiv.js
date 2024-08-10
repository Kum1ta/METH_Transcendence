/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   createThreeDiv.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 18:09:36 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/10 18:30:31 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

function	createThreeDiv()
{
	const	divThree	= document.createElement("div");

	divThree.setAttribute("id", "threeDiv");
	const scene = new THREE.Scene();
	// const camera = new THREE.PerspectiveCamera(75, divThree.innerWidth / divThree.innerHeight, 0.1, 1000);
	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer( {antialias: true} );
	// renderer.setSize(divThree.innerWidth, divThree.innerHeight);
	renderer.setSize(200, 700);
	divThree.appendChild(renderer.domElement);
	renderer.setClearColor(0x020202);

	let geometrie = new THREE.BoxGeometry(1, 1, 1);
	
	let materiel = new THREE.MeshBasicMaterial({color:0xffffff});
	
	const mesh = new THREE.Mesh( geometrie, materiel)

	camera.position.set(0, 0 ,4);

	renderer.antialias

	loop()

	function loop(){
		requestAnimationFrame(loop);
		let xsize = divThree.offsetWidth;
		let ysize = divThree.offsetHeight;
		renderer.setSize(xsize, ysize);
		camera.aspect = xsize / ysize;
		camera.updateProjectionMatrix()
		console.log(xsize, ysize);
		mesh.rotation.y += 0.001;
		mesh.rotation.x += 0.0005;
		renderer.render(scene, camera);
	}

	scene.add(mesh);
	renderer.render(scene, camera);
	return (divThree);
}

export { createThreeDiv };