/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeChangePfp.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/24 15:54:01 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/24 17:36:57 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let changePfp = [];
let changePfpAvailable = false;
let changePfpResolve = null;

function waitForchangePfp()
{
	return new Promise((resolve) => {
		if (changePfpAvailable)
		{
			changePfpAvailable = false;
			resolve(changePfp);
		}
		else
			changePfpResolve = resolve;
	});
}

function typeChangePfp(list)
{
	changePfp = list;
	changePfpAvailable = true;
	if (changePfpResolve)
	{
		changePfpResolve(changePfp);
		changePfpResolve = null;
		changePfpAvailable = false;
	}
}

export { typeChangePfp, waitForchangePfp };