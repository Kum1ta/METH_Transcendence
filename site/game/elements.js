/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   elements.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 16:07:51 by hubourge          #+#    #+#             */
/*   Updated: 2024/08/07 16:12:33 by hubourge         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import * as THREE from 'three';

/* --- Box items --- */
let BoxWidth = 1;
let BoxHeight = 0.1;
let BoxThickness = 0.1;

function createBox(scene, x, y, z)
{
	const geometryBox = new THREE.BoxGeometry(BoxWidth, BoxHeight, BoxThickness);
	const materialBox = new THREE.MeshLambertMaterial({
		color: 0xff0000,
	});
	const box = new THREE.Mesh(geometryBox, materialBox);
	box.position.set(x, y, z);
	box.rotateY(Math.PI / 2);
	box.receiveShadow = true;
	scene.add(box);
	return box;
}

export { createBox };