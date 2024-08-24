/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Map.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 14:52:55 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/24 20:36:07 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/three/build/three.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/*
	Todo (Eddy) :
		- Ajouter la transparence sur les murs sur la distance de la balle (OK)
		- Ajouter des textures selon le type : number pour couleur, string pour img (OK)
		- Ajouter une fonctione pour modifier la gravité (OK)
*/

const loader = new GLTFLoader();

class Map
{
	scene = null;
	arrObject = [];
	ballObject = null;
	mapLength = 0;
	banner = null;
	centerPos = {
		x: -1,
		y: -1,
		z:-1
	};
	playerLimits = {
		up : 3,
		down: 0.3,
		left: -3,
		right: 3,
	};
	ballIsOnJumper = {
		can: true
	};
	
	constructor(scene, length, obstacles)
	{
		this.scene = scene;
		this.centerPos.x = 0;
		this.centerPos.y = 0.15;
		this.centerPos.z = -length / 2 + length / 2;
		this.mapLength = length;
		scene.add(this.#createPlanes(7.5, length, -(Math.PI / 2), "planeBottom", true, '/textures/pastel.jpg'));
		scene.add(this.#createPlanes(7.5, length, (Math.PI / 2), "planeTop", false, '/textures/pastel.jpg'));
		scene.add(this.#createWall(-3.5, 0.4, -length/2, "wallLeft"));
		scene.add(this.#createWall(3.5, 0.4, -length/2, "wallRight"));
		this.#createBanner();
		if (obstacles)
			this.#generateObstacle();

		/***** JUST FOR TEST *****/
		document.addEventListener('keypress', (e) => {
			if (e.key == 'q')
			{
				for (let i = 0; i < this.arrObject.length; i++)
				{
					if (this.arrObject[i].type == 'jumper')
						this.#animationGravityChanger(this.arrObject[i].mesh)
				}
			}
		})
		/*************************/
	};

	#createPlanes(x, y, rot, name, isBottom, visual)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
				throw Error("Name already exist.");
		}

		const	geometry	= new THREE.PlaneGeometry(x, y);
		let		material	= null;
		let		mesh		= null;

		if (typeof(visual) == 'string')
		{
			const textureLoader = new THREE.TextureLoader();
			const texture = textureLoader.load(visual);
			material = new THREE.MeshPhysicalMaterial({ map: texture });
		}
		else if (typeof(visual) == 'number')
			material = new THREE.MeshPhysicalMaterial({ color: visual });
		else
			material = new THREE.MeshPhysicalMaterial();
		mesh = new THREE.Mesh(geometry, material);
		mesh.rotateX(rot);
		if (isBottom)
			mesh.position.set(0, 0.15, 0);
		else
			mesh.position.set(0, 3.15, 0);
		this.arrObject.push({mesh: mesh, name: name, type: "plane"});
		mesh.receiveShadow = true;
		return (mesh);
	};

	#createWall(x, y, z, name)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
				throw Error("Name already exist.");
		}
		const geometry	= new THREE.BoxGeometry(0.05, 0.5, 0.75);
		const material	= new THREE.MeshPhysicalMaterial();
		const mesh		= new THREE.Mesh(geometry, material);

		mesh.position.set(x, y, z);
		material.transparent = true;
		material.opacity = 0.5;
		this.arrObject.push({mesh: mesh, name: name, type: "wall"});
		return (mesh);
	};

	#createGravityChanger(x, y, z, name, typeName, onTop)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == name)
				throw Error("Name already exist.");
		}
		const geometry1	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		const material1	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const ring1		= new THREE.Mesh(geometry1, material1);
		ring1.rotateX(-Math.PI / 2);
		ring1.position.set(0, 0, 0);
		ring1.scale.set(0.2, 0.2, 0.2);
		material1.transparent = true;
		material1.opacity = 0.75;
		
		const geometry2	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		const material2	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const ring2		= new THREE.Mesh(geometry2, material2);
		ring2.rotateX(-Math.PI / 2);
		ring2.position.set(0, 0 + 0.1, 0);
		ring2.scale.set(0.18, 0.18, 0.18);
		material2.transparent = true;
		material2.opacity = 0.65;

		const geometry3	= new THREE.TorusGeometry(1, 0.1, 12, 24);
		const material3	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const ring3		= new THREE.Mesh(geometry3, material3);
		ring3.rotateX(-Math.PI / 2);
		ring3.position.set(0, 0 + 0.2, 0);
		ring3.scale.set(0.16, 0.16, 0.16);
		material3.transparent = true;
		material3.opacity = 0.35;
		
		const geometry0	= new THREE.CircleGeometry(0.2, 24);
		const material0	= new THREE.MeshPhysicalMaterial({color: 0xaaffaa});
		const circle1		= new THREE.Mesh(geometry0, material0);
		circle1.rotateX(-Math.PI / 2);
		circle1.position.set(0, 0 - 0.048, 0);
		
		const geometry	= new THREE.CircleGeometry(0.24, 24);
		const material	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const circle2		= new THREE.Mesh(geometry, material);
		circle2.rotateX(-Math.PI / 2);
		circle2.position.set(0, 0 - 0.049, 0);
	
		const geometry4	= new THREE.CylinderGeometry(0.15, 0.15, 0.35);
		const material4	= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const collider		= new THREE.Mesh(geometry4, material4);
		collider.position.set(0, 0 + 0.1, 0);
		material4.transparent = true;
		material4.opacity = 0.1;
		
		const group = new THREE.Group();
		group.add(ring1);
		group.add(ring2);
		group.add(ring3);
		group.add(circle1);
		group.add(circle2);
		group.add(collider);
		
		// Set group position groud / top
		for (let i = 0; i < group.children.length && onTop; i++)
			group.children[i].position.set(x, y - 0.1, z);
		for (let i = 0; i < group.children.length && !onTop; i++)
			group.children[i].position.set(x, y, z);
		
		let distanceY = [-0.04, -0.14, -0.24, 0.048, 0.049, -0.125];
		let rotate = [0, 0, 0, 1, 1, 0];
		
		// Set distance between each object
		for (let i = 0; i < group.children.length; i++)
		{
			if (onTop)
			{
				if (rotate[i])
					group.children[i].rotateX(Math.PI);
				group.children[i].position.set(group.children[i].position.x, group.children[i].position.y + distanceY[i], group.children[i].position.z);
			}
			else
				group.children[i].position.set(group.children[i].position.x, group.children[i].position.y - distanceY[i], group.children[i].position.z);
		}
		
		this.arrObject.push({mesh: group, name: name, type: typeName});
		this.scene.add(group);
	};

	#createWallObstacle(x, y, size, onTop)
	{
		const	geometry	= new THREE.BoxGeometry(size, 0.5, 0.1);
		const	material	= new THREE.MeshPhysicalMaterial({color: 0xaaaafe});
		const	mesh		= new THREE.Mesh(geometry, material);


		if (onTop)
			mesh.position.set(x, this.playerLimits.up - 0.1, y);
		else
			mesh.position.set(x, 0.4, y);
		return (mesh);
	}

	/* Todo (Hugo) :
		- Faire une zone Player banner (importer un model blender)
		- Faire une zone pour les pub (s'inspirer de theFinals) (ok)
		
		- Effet gros pixel (ok)
		- Effet de lumière en 2d
		- Preparer une animation pour le but
	*/
	#createBanner()
	{
		// Create canvas
		const videoCanvas = document.createElement('canvas');
		const ctx = videoCanvas.getContext('2d');
		videoCanvas.width = 100 * 2.33 * 20;
		videoCanvas.height = 100;
		
		// Load videos
		const video1 = document.createElement('video');
		video1.src = '../textures/video/catch.mp4';
		video1.muted = true;
		video1.autoplay = true;
		video1.loop = true;
		video1.addEventListener('loadeddata', () => {
			video1.play();
			drawVideoOnCanvas();
		});

		const video2 = document.createElement('video');
		video2.src = '../textures/video/pingpong.mp4';
		video2.muted = true;
		video2.autoplay = true;
		video2.loop = true;
		video2.addEventListener('loadeddata', () => {
			video2.play();
			drawVideoOnCanvas();
		});

		const nbVideos = 2; // 1, 2
		const nbImages = 2; // 0 = 2 img, 1 = 4 img, 2 = 8 img, 3 = 16 img

		let vSettings = [
			{video: video1, imageWidth: 100 * 2.33, imageHeight: 100},	// 2 images
			{video: video2, imageWidth: 100 * 2.33, imageHeight: 100},	// 4 images
			{video: video1, imageWidth: 100 * 2.33, imageHeight: 100},	// 8 images
			{video: video2, imageWidth: 100 * 2.33, imageHeight: 100},	// 16 images
		];

		let spacingImages = [
			100 * 2.33 * 10 - (100 * 2.33),
			100 * 2.33 * 5 - (100 * 2.33),
			100 * 2.33 * 2.5 - (100 * 2.33),
			100 * 2.33 * 1.25 - (100 * 2.33),
		];

		function drawVideoOnCanvas() {
			ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);

			let nbDraw = 0;
			let vIndex = 0;
			let y = 0;
			for (let x = 0; x < videoCanvas.width; x += (vSettings[vIndex].imageWidth + spacingImages[nbImages]))
			{
				ctx.drawImage(vSettings[vIndex].video, x, y, vSettings[vIndex].imageWidth, vSettings[vIndex].imageHeight);
				nbDraw++;
				if (nbVideos > 1)
					vIndex++;
				if (vIndex >= nbVideos)
					vIndex = 0;
			}
			
			videoCanvasTexture.needsUpdate = true;
			requestAnimationFrame(drawVideoOnCanvas);
		}

		// Create texture
		const videoCanvasTexture = new THREE.CanvasTexture(videoCanvas);
		videoCanvasTexture.wrapS = THREE.RepeatWrapping;
		videoCanvasTexture.wrapT = THREE.RepeatWrapping;
		videoCanvasTexture.repeat.set(-1, 1);

		const material = new THREE.MeshBasicMaterial({ map: videoCanvasTexture, side: THREE.BackSide });

		// videoCanvas.innerHTML = 'Test';																	 // ca sert ca eddy ?
		loader.load( '../blender/exported/banner.glb', (gltf) => {
			this.banner = gltf.scene.children[0];
			this.banner.material = material;
			this.banner.position.y += 1.7;
			this.banner.rotation.x = (Math.PI);
			this.banner.rotation.y += -0.15;
			this.scene.add(gltf.scene);
			setInterval(() => {
				this.banner.rotation.y += 0.001;
			}, 10);
		}, undefined, function ( error ) {
			console.error( error );
		} );

        function animate() {
            requestAnimationFrame(animate);
        }
        animate();
	}
	
	#animationGravityChanger(group, onTop)
	{
		const geometry1		= new THREE.TorusGeometry(1.5, 0.05, 12, 24);
		const material1		= new THREE.MeshPhysicalMaterial({color: 0x00ff00});
		const ring1			= new THREE.Mesh(geometry1, material1);
		const landmark		= group.children[0];
		let	interval		= null;
		let	speed			= 0.1;

		ring1.rotateX(-Math.PI / 2);
		ring1.position.set(landmark.position.x, landmark.position.y, landmark.position.z);
		ring1.scale.set(0.2, 0.2, 0.2);
		ring1.material.transparent = true;
		this.scene.add(ring1);

		interval = setInterval(() => {
			if (onTop)
				ring1.position.y -= speed;
			else
				ring1.position.y += speed;
			ring1.material.opacity -= 0.02;
			speed *= 0.90;
			if (ring1.material.opacity == 0)
				clearInterval(interval);
		}, 10);
	}

	#generateObstacle()
	{
		const wallPos = [
			{ x: 1, y: 0, z: 1, onTop: false},
			{ x: 1, y: 0, z: 1, onTop: true},
			{ x: -1, y: 0, z: 1, onTop: false},
			{ x: -1, y: 0, z: 1, onTop: true}
		];
		for (let i = 0; i < wallPos.length; i++)
		{
			if (Math.random() < 0.5)
				this.scene.add(this.#createWallObstacle(wallPos[i].x, wallPos[i].y, wallPos[i].z, wallPos[i].onTop));
		}

		const type = "gravityChanger";
		const typeNameBottom = "jumperBottom";
		const typeNameTop = "jumperTop";
		const jumperPos = [
			{ x: -1.5, y: 0.2, z: this.mapLength / 4, type: type, typeName: typeNameBottom, onTop: false},
			{ x: -1.5, y: 3.2, z: this.mapLength / 4, type: type, typeName: typeNameTop, onTop: true},
			{ x: 1.5, y: 0.2, z: this.mapLength / 4, type: type, typeName: typeNameBottom, onTop: false},
			{ x: 1.5, y: 3.2, z: this.mapLength / 4, type: type, typeName: typeNameTop, onTop: true},
			{ x: -1.5, y: 0.2, z: -this.mapLength / 4, type: type, typeName: typeNameBottom, onTop: false},
			{ x: -1.5, y: 3.2, z: -this.mapLength / 4, type: type, typeName: typeNameTop, onTop: true},
			{ x: 1.5, y: 0.2, z: -this.mapLength / 4, type: type, typeName: typeNameBottom, onTop: false},
			{ x: 1.5, y: 3.2, z: -this.mapLength / 4, type: type, typeName: typeNameTop, onTop: true}
		];
		for (let i = 0; i < jumperPos.length; i++)
		{
			if (Math.random() < 0.5)
			{
				this.#createGravityChanger(jumperPos[i].x, jumperPos[i].y, jumperPos[i].z, jumperPos[i].type + i, jumperPos[i].typeName, jumperPos[i].onTop);
				if (i % 2 == 0)
					i++;
			}
		}
	};

	update(ball)
	{
		for (let i = 0; i < this.arrObject.length; i++)
		{
			if (this.arrObject[i].name == "wallLeft")
			{
				// Move the wall with the ball position
				if (ball.object.position.z < this.mapLength / 2 - 0.35 && ball.object.position.z > -this.mapLength / 2 + 0.35)
					this.arrObject[i].mesh.position.z = ball.object.position.z;
				if (ball.object.position.y > 0.4 + 0.1 && ball.object.position.y < 3.2)
					this.arrObject[i].mesh.position.y = ball.object.position.y - 0.1;
				
				// Change the opacity of the wall
				let	diff = ball.object.position.x - this.arrObject[i].mesh.position.x - 0.1;
				if (diff > 2)
					this.arrObject[i].mesh.material.opacity = 0;
				else
					this.arrObject[i].mesh.material.opacity = 1 - (diff / 2);
			}
			if (this.arrObject[i].name == "wallRight")
			{
				// Move the wall with the ball position
				if (ball.object.position.z < this.mapLength / 2 - 0.35 && ball.object.position.z > -this.mapLength / 2 + 0.35)
					this.arrObject[i].mesh.position.z = ball.object.position.z;
				if (ball.object.position.y > 0.4 + 0.1 && ball.object.position.y < 3.2)
					this.arrObject[i].mesh.position.y = ball.object.position.y - 0.1;

				// Change the opacity of the wall
				let	diff = this.arrObject[i].mesh.position.x - ball.object.position.x - 0.1;
				if (diff > 2)
					this.arrObject[i].mesh.material.opacity = 0;
				else
					this.arrObject[i].mesh.material.opacity = 1 - (diff / 2);
			}
			if (this.arrObject[i].type == 'jumperBottom')
			{
				const cylinder	= this.arrObject[i].mesh.children[5];
				const distance	= ball.object.position.distanceTo(cylinder.position);
				const speed		= 0.1;

				// Detect if the ball is on the jumper
				if (distance < 0.25 && this.ballIsOnJumper.can)
				{
					this.ballIsOnJumper.can = false;
					ball.changeGravity(this.ballIsOnJumper);
					this.#animationGravityChanger(this.arrObject[i].mesh, false);
				}

				// Gravity changer animation
				for (let j = 0; j < 3; j++)
				{
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
				}
			}
			if (this.arrObject[i].type == 'jumperTop')
			{
				const cylinder	= this.arrObject[i].mesh.children[5];
				const distance	= ball.object.position.distanceTo(cylinder.position);
				const speed		= 0.1;
				
				// Detect if the ball is on the jumper
				if (distance < 0.4 && this.ballIsOnJumper.can)
				{
					this.ballIsOnJumper.can = false;
					ball.changeGravity(this.ballIsOnJumper);
					this.#animationGravityChanger(this.arrObject[i].mesh, true);
				}

				// Gravity changer animation
				for (let j = 0; j < 3; j++)
				{
					this.arrObject[i].mesh.children[j].rotation.x = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.PI / 2;
					this.arrObject[i].mesh.children[j].rotation.y = Math.sin(Date.now() * 0.001 + (j - 2) * 5) * 0.1 + Math.cos(Date.now() * 0.001) * 0.1;;
				}
			}
		}
	};
};

export { Map };