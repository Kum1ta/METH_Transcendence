/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   3d.js                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/13 13:59:46 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/29 23:24:39 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/javascript/three/build/three.module.js'
import { files } from '/static/javascript/filesLoader.js';

let 	actualBarSelecor	= null;
let 	actualGoalSelecter	= null;
let		lastSelected		= null;
const	availableSkins	=	[
	{id: 0, color: 0xff53aa, texture: null},
	{id: 1, color: 0xaa24ea, texture: null},
	{id: 2, color: 0x2c9c49, texture: null},
	{id: 3, color: 0x101099, texture: null},
	{id: 4, color: null, texture: null},
	{id: 5, color: null, texture: null},
	{id: 6, color: null, texture: null},
	{id: 7, color: null, texture: null},
];

class barSelecter
{
	scene			= null;
	renderer		= null;
	camera			= null;
	spotLight		= new THREE.SpotLight(0xffffff, 5);
	selected		= lastSelected ? lastSelected : availableSkins[0];
	bar				= this.createBarPlayer(this.selected.color ? this.selected.color : this.selected.texture);
	boundChangeSkin = this.changeSkin.bind(this);


	constructor(div)
	{
		const	pos		= div.getBoundingClientRect();
		this.scene		= new THREE.Scene();
		this.renderer	= new THREE.WebGLRenderer({antialias: true});
		this.camera		= new THREE.PerspectiveCamera(60, (pos.width - 10) / (pos.height - 10));
	
		if (!lastSelected)
			lastSelected = availableSkins[0];
		this.scene.background = new THREE.Color(0x020202);
		this.renderer.setSize(pos.width - 10, pos.height - 10);
		this.scene.add(this.spotLight);
		this.camera.position.set(0.7, 0.5, 0.7);
		this.spotLight.position.set(0.7, 0.5, 0.7);
		div.appendChild(this.renderer.domElement);
		actualBarSelecor = this;
		this.scene.add(this.bar);
		actualBarSelecor.camera.lookAt(actualBarSelecor.bar.position);
		this.spotLight.target = this.bar;
		this.spotLight.lookAt(this.bar.position);
		this.renderer.setAnimationLoop(this.#loop);
		availableSkins[4].texture = files.skinOneTexture;
		availableSkins[5].texture = files.skinTwoTexture;
		availableSkins[6].texture = files.skinThreeTexture;
		availableSkins[7].texture = files.skinFourTexture;
		div.addEventListener('click', () => {
			const	popup	=	document.getElementById('popup-background');
			const	skins	=	document.getElementsByClassName('color-box');
		
			popup.style.display = 'flex';
			for (let i = 0; i < skins.length; i++)
			{
				skins[i].setAttribute('skinId', availableSkins[i].id);
				if (availableSkins[i].color != null)
					skins[i].style.backgroundColor = `#${availableSkins[i].color.toString(16)}`;
				else
					skins[i].style.backgroundImage = `url("${availableSkins[i].texture}")`
				skins[i].removeEventListener('click', this.boundChangeSkin);
				skins[i].addEventListener('click', this.boundChangeSkin);
			}
			popup.removeEventListener('click', this.hideSkinSelector);
			popup.addEventListener('click', this.hideSkinSelector);
		})
	}

	hideSkinSelector(event)
	{
		const	popup	=	document.getElementById('popup-background');

		if (event.target.getAttribute('class') == 'popup-background')
			popup.style.display = 'none';
	}

	changeSkin (event)
	{
		const	popup	=	document.getElementById('popup-background');
	
		const id = event.target.getAttribute('skinId');
		popup.style.display = 'none';
		console.log(this.bar);
		this.bar.material.dispose();
		lastSelected = availableSkins[id];
		if (availableSkins[id].color != null)
			this.bar.material = new THREE.MeshPhysicalMaterial({color: availableSkins[id].color});
		else
			this.bar.material = new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(availableSkins[id].texture)});
		this.selected = availableSkins[id];
	}

	createBarPlayer(color)
	{
		const	geometry	= new THREE.BoxGeometry(1, 0.1, 0.1);
		let		material	= null;

		if (typeof(color) == 'number')
			material = new THREE.MeshPhysicalMaterial({color: color});
		else
			material = new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(color)});
		const	mesh		= new THREE.Mesh(geometry, material);

		mesh.castShadow = true;
		return (mesh);
	}

	#loop()
	{
		actualBarSelecor.renderer.render(actualBarSelecor.scene, actualBarSelecor.camera);
		actualBarSelecor.bar.rotation.y += 0.005;
	}

	dispose()
	{
		if (this.renderer)
			this.renderer.dispose();
		this.renderer = null;
		if (this.scene)
		{
			this.scene.children.forEach(child => {
				if (child.geometry)
					child.geometry.dispose();
				if (child.material)
					child.material.dispose();
				if (child.texture)
					child.texture.dispose();
				this.scene.remove(child);
			});
		}
		this.scene = null;
		actualBarSelecor = null;
	}
}

class goalSelecter
{
	scene			= null;
	renderer		= null;
	camera			= null;
	ambiantLight	= new THREE.AmbientLight(0xffffff, 35);
	goal			= this.createGoal(0xffffff);

	constructor(div)
	{
		const	pos		= div.getBoundingClientRect();
		this.scene		= new THREE.Scene();
		this.renderer	= new THREE.WebGLRenderer({antialias: true});
		this.camera		= new THREE.PerspectiveCamera(60, (pos.width - 10) / (pos.height - 10));
	
		this.scene.background = new THREE.Color(0x020202);
		this.renderer.setSize(pos.width - 10, pos.height - 10);
		this.scene.add(this.ambiantLight);
		this.camera.position.set(0.7, 0.5, 0.7);
		div.appendChild(this.renderer.domElement);
		actualGoalSelecter = this;
		this.scene.add(this.goal);
		this.camera.lookAt(actualGoalSelecter.goal.position);
		this.renderer.setAnimationLoop(this.#loop);
	}

	createGoal(color)
	{
		const geometry	= new THREE.BoxGeometry(1, 0.1, 0.1);
		const material	= new THREE.MeshPhysicalMaterial({color: color});
		const mesh		= new THREE.Mesh(geometry, material);

		mesh.castShadow = true;
		return (mesh);
	}

	#loop()
	{
		actualGoalSelecter.goal.rotation.y += 0.1;
		actualGoalSelecter.goal.rotation.x += 0.1;
		actualGoalSelecter.goal.rotation.z += 0.1;
		actualGoalSelecter.renderer.render(actualGoalSelecter.scene, actualGoalSelecter.camera);
	}

	dispose()
	{
		if (this.renderer)
			this.renderer.dispose();
		this.renderer = null;
		if (this.scene)
		{
			this.scene.children.forEach(child => {
				if (child.geometry)
					child.geometry.dispose();
				if (child.material)
					child.material.dispose();
				if (child.texture)
					child.texture.dispose();
				this.scene.remove(child);
			});
		}
		this.scene = null;
		actualGoalSelecter = null;
	}
}

export { barSelecter, goalSelecter, lastSelected, availableSkins}