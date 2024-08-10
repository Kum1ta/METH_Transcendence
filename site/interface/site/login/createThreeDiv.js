/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   createThreeDiv.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 18:09:36 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/10 17:13:41 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function	createThreeDiv()
{
	const	divThree	= document.createElement("div");

	divThree.setAttribute("id", "threeDiv");
	
	return (divThree);
}

export { createThreeDiv };