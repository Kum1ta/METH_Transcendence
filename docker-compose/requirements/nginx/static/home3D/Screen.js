/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Screen.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/22 23:13:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/24 20:44:14 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/three/build/three.module.js'
import { GLTFLoader } from '/static/three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

class Screen
{
	screen = null;
	tv = null;
	pointLightIntensity = 1;
	screenMaterial = null;

	constructor(scene)
	{

		this.screen = this.#createScreen(scene);
		loader.load( '/static/modeles/tv.glb', (gltf) => {
			const tv = gltf.scene.children[0];
			const boundingBox = new THREE.Box3().setFromObject(tv);
			const center = boundingBox.getCenter(new THREE.Vector3());
			tv.geometry.center();
			this.tv = tv;
			tv.position.set(0, 0.99, 2);
			tv.material = new THREE.MeshPhysicalMaterial({color: 0xaaaaaa});
			tv.material.roughness = 10;
			tv.material.metalness = 1;
			tv.scale.set(0.05, 0.05, 0.05);
			tv.castShadow = true;
			tv.receiveShadow = true;
			scene.add(tv);
		}, undefined, function ( error ) {
			console.error( error );
			throw Error("Can't open file 'tv.glb'");
		} );
		this.#showVideo('/static/modeles/pong.mp4')
	}

	#createScreen(scene)
	{
		const	geometry			= new THREE.PlaneGeometry(4.1, 3, 50, 50); 
		const	positionAttribute	= geometry.attributes.position;
		const	vertices 			= positionAttribute.array;
		const	material			= new THREE.MeshStandardMaterial({color: 0xbbbbbb});
		const	mesh				= new THREE.Mesh(geometry, material);
		const	pointLight			= new THREE.PointLight( 0xffffff, 10 * this.pointLightIntensity, 0, 2);

		for (let i = 0; i < vertices.length; i += 3)
		{
			const x = vertices[i];
			const y = vertices[i + 1];
			const distance = (Math.sqrt(x * x + y * y));
			const height = Math.pow(distance, 2) * -0.02;
			vertices[i + 2] = height;
		}
		positionAttribute.needsUpdate = true;
		mesh.scale.set(0.41, 0.42);
		mesh.position.set(-0.155, 1.2, 1.15);
		mesh.rotation.x = Math.PI + 0.05;
		mesh.rotation.z = Math.PI;
		scene.add(mesh);
		pointLight.position.set(-0.05, 1.2, 0.95);
		pointLight.castShadow = true;
		pointLight.shadow.mapSize.width = 2048;
		pointLight.shadow.mapSize.height = 2048;
		console.log(pointLight.shadow)
		scene.add(pointLight);
		setInterval(() => {
			const	intensity = Math.random() * 2 + 10;
			
			pointLight.intensity = intensity * this.pointLightIntensity > 13 * this.pointLightIntensity ? 13 * this.pointLightIntensity : intensity * this.pointLightIntensity;
		}, 100);
		return (mesh);
	}

	#showVideo(path)
	{
		const	canvas		= document.createElement('canvas');
		const	context		= canvas.getContext('2d', { willReadFrequently: true });
		const	video		= document.createElement('video');
		const	texture		= new THREE.CanvasTexture(canvas);
		const	material	= new THREE.MeshBasicMaterial({ map: texture,color: 0xffffff, transparent: true, opacity: 1 });
		
		canvas.width = 534;
		canvas.height = 360;
		video.src = path + '?t=' + new Date().getTime();
		video.loop = true;
		video.muted = true;
		video.crossOrigin = 'anonymous';

		video.addEventListener('loadedmetadata', () => {
			const texture = this.screen.material.map;
        	texture.needsUpdate = true;
			video.play().then(() => {
				updateCanvas();
			}).catch(err => console.error("Error playing video: ", err));
		});

		function addNoiseOnImage(context)
		{
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;
			for (let i = 0; i < data.length; i += 4)
			{
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];
				const brightness = (3 * r + 4 * g + b) >>> 3;
				const noise = Math.random() * 128 - 32;
				data[i] = data[i + 1] = data[i + 2] = brightness + noise;
			}
			context.putImageData(imageData, 0, 0);
		}

		function updateCanvas()
		{
			if (!video.paused && !video.ended)
			{
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				addNoiseOnImage(context);
				texture.needsUpdate = true;
			}
			requestAnimationFrame(updateCanvas);
		}
		texture.offset.set(0.02, 0);
		this.screen.material = material;
		video.load();
	}
};

export { Screen };