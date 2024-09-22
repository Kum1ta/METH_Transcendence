/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Page.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/25 00:00:21 by edbernar          #+#    #+#             */
/*   Updated: 2024/09/23 00:59:54 by edbernar         ###   ########.fr       */
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
		{suffix: false, url:'/', servUrl: '/homePage', class: HomePage, name: 'homePage', title: 'METH - Home'},
		{suffix: false, url:'/lobby', servUrl: '/lobbyPage', class: LobbyPage, name: 'lobbyPage', title: 'METH - Lobby'},
		{suffix: false, url:'/game', servUrl: '/multiLocalGamePage', class: multiLocalGamePage, name: 'multiLocalGamePage', title: 'METH - Game'},
		{suffix: false, url:'/wait_game', servUrl: '/waitingGamePage', class: WaitingGamePage, name: 'waitingGamePage', title: 'METH - Wait for a game'},
		{suffix: false, url:'/game', servUrl: '/multiOnlineGamePage', class: MultiOnlineGamePage, name: 'multiOnlineGamePage', title: 'METH - Game'},
		{suffix: true, url:'/profil', servUrl: '/profilPage', class: ProfilPage, name: 'profilPage', title: 'METH - Profil'},
	]

	constructor()
	{
		const thisClass = this;
		window.onpopstate = function(event) {
			for (let i = 0; i < thisClass.availablePages.length; i++)
			{
				if (window.location.pathname == thisClass.availablePages[i].url || (thisClass.availablePages[i].suffix && window.location.pathname.startsWith(thisClass.availablePages[i].url)))
				{
					let arg = window.location.pathname.slice(thisClass.availablePages[i].url.length + 1);
					if (arg == "" || !thisClass.availablePages[i].suffix)
						arg = null;
					thisClass.changePage(thisClass.availablePages[i].name, true, arg, !thisClass.availablePages[i].suffix);
					return ;
				}
			}
		};
		for (let i = 0; i < this.availablePages.length; i++)
		{
			if (window.location.pathname == this.availablePages[i].url || (thisClass.availablePages[i].suffix && window.location.pathname.startsWith(thisClass.availablePages[i].url)))
			{
				let arg = window.location.pathname.slice(thisClass.availablePages[i].url.length + 1);
				if (arg == "" || !thisClass.availablePages[i].suffix)
					arg = null;
				this.changePage(this.availablePages[i].name, false, arg, !thisClass.availablePages[i].suffix);
				return ;
			}
		}
		this.#showUnknownPage();
	}
	
	changePage(name, isBack = false, arg = null, needToChangePath = true)
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
						{
							if (needToChangePath)
								history.pushState({}, this.availablePages[i].title, this.availablePages[i].url);
							else
								history.pushState({}, this.availablePages[i].title, window.location.pathname);
						}
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