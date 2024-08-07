/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   createThreeDiv.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/07 18:09:36 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/07 18:11:19 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function	createThreeDiv()
{
	const	divThree	= document.createElement("div");

	divThree.setAttribute("id", "threeDiv");
	return (divThree);
}

export { createThreeDiv };