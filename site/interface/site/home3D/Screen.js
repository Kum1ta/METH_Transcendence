/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Screen.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/22 23:13:53 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/24 16:56:57 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three'

const loader = new GLTFLoader();

let	light = {
	point: 1,
};


class Screen
{
	screen = null;
	tv = null;
	screenMaterial = null;
	canvasVideo = null;
	interval = null;

	constructor(scene)
	{

		this.screen = this.#createScreen(scene);
		loader.load( './modeles/tv.glb', (gltf) => {
			const tv = gltf.scene.children[0];
			const boundingBox = new THREE.Box3().setFromObject(tv);
			const center = boundingBox.getCenter(new THREE.Vector3());
			tv.geometry.center();
			this.tv = tv;
			tv.position.set(0, 0.99, 2);
			tv.material = new THREE.MeshPhysicalMaterial({color: 0xaaaaaa});
			tv.material.roughness = 1;
			tv.material.metalness = 1.05;
			tv.scale.set(0.05, 0.05, 0.05);
			tv.castShadow = true;
			tv.receiveShadow = true;
			scene.add(tv);
			this.showVideo('/modeles/pong.mp4');
		}, undefined, function ( error ) {
			console.error( error );
			throw Error("Can't open file 'tv.glb'");
		} );
	}

	#createScreen(scene)
	{
		const	geometry			= new THREE.PlaneGeometry(4.1, 3, 50, 50); 
		const	positionAttribute	= geometry.attributes.position;
		const	vertices 			= positionAttribute.array;
		const	material			= new THREE.MeshStandardMaterial({color: 0xbbbbbb});
		const	mesh				= new THREE.Mesh(geometry, material);
		// const	pointLight			= new THREE.PointLight( 0xffffff, 10 * light.point, 0, 2);
		const	pointLight			= new THREE.SpotLight(0xffffff, 10 * light.point, 0, Math.PI / 1.6);

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
		
		const targetObject = new THREE.Object3D();
		targetObject.position.set(0, 1.2, 0);
		pointLight.target = targetObject;
		pointLight.target.updateMatrixWorld();
		scene.add(pointLight);
		setInterval(() => {
			const	intensity = Math.random() * 2 + 10;
			
			pointLight.intensity = intensity * light.point > 13 * light.point ? 13 * light.point : intensity * light.point;
		}, 100);
		return (mesh);
	}

	changeVideo(path)
	{
		this.#disposeVideo();
		this.showVideo(path);
	}
	
	showVideo(path)
	{
		const	canvas		= document.createElement('canvas');
		const	context		= canvas.getContext('2d', { willReadFrequently: true });
		const	video		= document.createElement('video');
		const	texture		= new THREE.CanvasTexture(canvas);
		const	material	= new THREE.MeshBasicMaterial({ map: texture,color: 0xffffff, transparent: true, opacity: 1 });
		
		canvas.video = video;
		canvas.context = context;
		canvas.width = 534;
		canvas.height = 360;
		this.canvasVideo = canvas;
		video.src = path;
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

		// function addNoiseOnImage(context)
		// {
		// 	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		// 	const data = imageData.data;
		// 	for (let i = 0; i < data.length; i += 4)
		// 	{
		// 		const r = data[i];
		// 		const g = data[i + 1];
		// 		const b = data[i + 2];
		// 		const brightness = (3 * r + 4 * g + b) >>> 3;
		// 		const noise = Math.random() * 128 - 32;
		// 		data[i] = data[i + 1] = data[i + 2] = brightness + noise;
		// 	}
		// 	context.putImageData(imageData, 0, 0);
		// }

		function updateCanvas()
		{
			if (canvas.video != null || canvas.video == undefined)
			{
				if (canvas.video && !canvas.video.paused && !canvas.video.ended)
				{
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(canvas.video, 0, 0, canvas.width, canvas.height);
					// addNoiseOnImage(context);
					texture.needsUpdate = true;
				}
				requestAnimationFrame(updateCanvas);
			}
		}
		texture.offset.set(0.05, 0);
		this.screen.material = material;
		canvas.video.load();
	}

	#disposeVideo()
	{
		if (this.canvasVideo)
		{
			const canvas	= this.canvasVideo;
			const video		= canvas.video;
			const texture	= this.screen.material.map;
	
			if (video)
			{
				video.pause();
				video.src = '';
				video.removeAttribute('src');
				video.load();
			}
			if (texture)
				texture.dispose();
			canvas.video = null;
			canvas.context = null;
			if (this.screen)
			{
				this.screen.material.map = null;
				this.screen.material.dispose();
			}
			this.canvasVideo = null;
		}
	}
	

};

export { Screen, light };