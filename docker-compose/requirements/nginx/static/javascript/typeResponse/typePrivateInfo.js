/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typePrivateInfo.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/25 22:34:46 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/25 23:07:41 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let PrivateInfo = {};
let PrivateInfoAvailable = false;
let PrivateInfoResolve = null;

function waitForPrivateInfo()
{
	return new Promise((resolve) => {
		if (PrivateInfoAvailable)
		{
			PrivateInfoAvailable = false;
			resolve(PrivateInfo);
		}
		else
			PrivateInfoResolve = resolve;
	});
}

function typePrivateInfo(data)
{
	PrivateInfo = data;
	PrivateInfoAvailable = true;
	if (PrivateInfoResolve)
	{
		PrivateInfoResolve(PrivateInfo);
		PrivateInfoResolve = null;
		PrivateInfoAvailable = false;
	}
}

export { typePrivateInfo, waitForPrivateInfo };