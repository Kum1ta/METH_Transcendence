/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   3d.js                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/13 13:59:46 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/13 15:36:35 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from '/static/javascript/three/build/three.module.js'

let actualBarSelecor = null;
let actualGoalSelecter = null;

class barSelecter
{
	scene			= null;
	renderer		= null;
	camera			= null;
	ambiantLight	= new THREE.AmbientLight(0xffffff, 35);
	bar				= this.createBarPlayer(0xe3e3e3)

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
		actualBarSelecor = this;
		this.scene.add(this.bar);
		actualBarSelecor.camera.lookAt(actualBarSelecor.bar.position);
		this.renderer.setAnimationLoop(this.#loop);
	}

	createBarPlayer(color)
	{
		const geometry	= new THREE.BoxGeometry(1, 0.1, 0.1);
		const material	= new THREE.MeshPhysicalMaterial({color: color});
		const mesh		= new THREE.Mesh(geometry, material);

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

export { barSelecter, goalSelecter }