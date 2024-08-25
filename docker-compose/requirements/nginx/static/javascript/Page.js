/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Page.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/25 00:00:21 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/25 21:09:33 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { HomePage } from "/static/javascript/homePage/main.js";
import { LobbyPage } from "/static/javascript/lobbyPage/main.js";

class Page
{
	actualPage = null;
	availablePages = [
		{url:'/', servUrl: '/homePage', class: HomePage, name: 'homePage', title: 'PTME - Home'},
		{url:'/lobby', servUrl: '/lobbyPage', class: LobbyPage, name: 'lobbyPage', title: 'PTME - Lobby'},
	]

	constructor()
	{
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
	
	changePage(name)
	{
		if (this.actualPage != null)
			this.actualPage.dispose();
		for (let i = 0; i < this.availablePages.length; i++)
		{
			if (name === this.availablePages[i].name)
			{
				fetch(this.availablePages[i].servUrl)
				.then(response => {
					if (response.status != 200)
						throw Error("Page '" + name + "' can't be loaded")
					return (response);
				})
				.then(data => {
					data.text().then(text => {
						console.log("Page updated !");
						document.body.innerHTML = text;
						this.actualPage = this.availablePages[i].class;
						document.title = this.availablePages[i].title;
						history.pushState({}, this.availablePages[i].title, this.availablePages[i].url);
						this.actualPage.create();
					})
				})
				.catch(error => {
					throw Error(error);
				});

				return ;
			}
		}
		throw Error("Page '" + page + "' not exist");
	}

	#showUnknownPage()
	{
		document.body.innerHTML = "404 - Page not found";
	}
};

export { Page }