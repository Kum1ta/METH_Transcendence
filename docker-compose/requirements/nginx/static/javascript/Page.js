/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Page.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/25 00:00:21 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/22 18:58:44 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { MultiOnlineGamePage } from "/static/javascript/multiOnlineGame/multiOnlineGamePage.js"
import { multiLocalGamePage } from "/static/javascript/multiLocalGame/multiLocalGamePage.js"
import { WaitingGamePage } from "/static/javascript/waitingGame/main.js"
import { ProfilPage } from "/static/javascript/profilPage/main.js";
import { LobbyPage } from "/static/javascript/lobbyPage/main.js";
import { HomePage } from "/static/javascript/homePage/main.js";

class Page
{
	actualPage = null;
	availablePages = [
		{url:'/', servUrl: '/homePage', class: HomePage, name: 'homePage', title: 'METH - Home'},
		{url:'/lobby', servUrl: '/lobbyPage', class: LobbyPage, name: 'lobbyPage', title: 'METH - Lobby'},
		{url:'/game', servUrl: '/multiLocalGamePage', class: multiLocalGamePage, name: 'multiLocalGamePage', title: 'METH - Game'},
		{url:'/wait_game', servUrl: '/waitingGamePage', class: WaitingGamePage, name: 'waitingGamePage', title: 'METH - Wait for a game'},
		{url:'/game', servUrl: '/multiOnlineGamePage', class: MultiOnlineGamePage, name: 'multiOnlineGamePage', title: 'METH - Game'},
		{url:'/profil', servUrl: '/profilPage', class: ProfilPage, name: 'profilPage', title: 'METH - Profil'},
	]

	constructor()
	{
		const thisClass = this;
		window.onpopstate = function(event) {
			for (let i = 0; i < thisClass.availablePages.length; i++)
			{
				if (window.location.pathname == thisClass.availablePages[i].url)
				{
					thisClass.changePage(thisClass.availablePages[i].name, true);
					return ;
				}
			}
		};
		for (let i = 0; i < this.availablePages.length; i++)
		{
			if (window.location.pathname == this.availablePages[i].url)
			{
				this.changePage(this.availablePages[i].name);
				return ;
			}
		}
		this.#showUnknownPage();
	}
	
	changePage(name, isBack = false, arg = null)
	{
		if (this.actualPage != null)
			this.actualPage.dispose();
		for (let i = 0; i < this.availablePages.length; i++)
		{
			if (name === this.availablePages[i].name)
			{
				fetch(this.availablePages[i].servUrl, {
					method: "POST",
				})
				.then(response => {
					if (response.status != 200)
						throw Error("Page '" + name + "' can't be loaded")
					return (response);
				})
				.then(data => {
					data.text().then(text => {
						document.body.innerHTML = text;
						this.actualPage = this.availablePages[i].class;
						document.title = this.availablePages[i].title;
						if (!isBack)
							history.pushState({}, this.availablePages[i].title, this.availablePages[i].url);
						if (arg)
							this.actualPage.create(arg);
						else
							this.actualPage.create();
						console.log("Page created.");
					})
				})
				.catch(error => {
					window.location.href = '/';
					// throw Error(error);
				});

				return ;
			}
		}
		throw Error("Page '" + name + "' not exist");
	}

	#showUnknownPage()
	{
		if (this.actualPage != null)
			this.actualPage.dispose();
		fetch('/404')
		.then(response => {
			if (response.status != 200)
				throw Error("Page '" + name + "' can't be loaded")
			return (response);
		})
		.then(data => {
			data.text().then(text => {
				document.body.innerHTML = text;
				this.actualPage = null;
				document.title = 'METH - Page not found';
				history.pushState({}, this.availablePages[i].title, this.availablePages[i].url);
			})
		})
		.catch(error => {
			window.location.href = '/';
			throw Error(error);
		});

	}
};

export { Page }