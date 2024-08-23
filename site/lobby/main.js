/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: madegryc <madegryc@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/22 17:08:46 by madegryc          #+#    #+#             */
/*   Updated: 2024/08/22 19:15:25 by madegryc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* 

    INFORMATION :

    id 0 = Multiplayer local
    id 1 = Matchmaking
    id 2 = Ranked
    id 3 = Tournament
*/

let gameMode = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementsByClassName('game-mode')[0].addEventListener('click', function() {
        document.getElementById('loginPopup').style.display = 'flex';
        console.log('Popup opened');
    });
    
    document.getElementById('closePopupBtn').addEventListener('click', function() {
        document.getElementById('loginPopup').style.display = 'none';
    });
    
    // Fermer la popup si on clique en dehors du contenu
    window.addEventListener('click', function(event) {
        if (event.target == document.getElementById('loginPopup')) {
            document.getElementById('loginPopup').style.display = 'none';
        }
    });
    

    const listSelectCard = document.getElementsByClassName('select-card');
    console.log('listSelectCard', listSelectCard);
	for(let i = 0; i < listSelectCard.length; i++) {
        listSelectCard[i].addEventListener('click', function() {
            console.log('Card selected:', listSelectCard[i].id);
            document.getElementById('loginPopup').style.display = 'none';
            document.getElementsByClassName('mode-card')[0].getElementsByTagName('p')[0].innerHTML = listSelectCard[i].innerHTML;
            gameMode = i;
        });
    }
});
