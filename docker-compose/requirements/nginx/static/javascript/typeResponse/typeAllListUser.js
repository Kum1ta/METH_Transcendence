/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   typeAllListUser.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/26 01:00:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/26 14:57:58 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let allListUser = [];
let allListUserAvailable = false;
let allListUserResolve = null;


function waitForallListUser()
{
	return new Promise((resolve) => {

		if (allListUserAvailable)
			resolve();
		else
			allListUserResolve = resolve;
	});
}

function typeAllListUser(list)
{
	allListUser = list;
	allListUserAvailable = true;
	if (allListUserResolve)
	{
		allListUserResolve(allListUser);
		allListUserResolve = null;
		allListUserAvailable = false;
	}
}

export { waitForallListUser, typeAllListUser, allListUser };