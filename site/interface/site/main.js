/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/30 13:50:35 by edbernar          #+#    #+#             */
/*   Updated: 2024/08/05 18:10:32 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { liveChat } from "./liveChat/main.js";
import { createNotification } from "./notification/main.js";

document.addEventListener('DOMContentLoaded', () => {
	liveChat();
});



document.addEventListener("keydown", (e) => {
	if (e.key === "+")
		createNotification.new("Server", "Server dsalj dhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkver dsalj dhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkver dsalj dhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkver dsalj dhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkver dsalj dhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkver dsalj dhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dkasjdl jsahkjd ashkjddhsakj hdsakjh dasjdl jsahkjd ashkjd shakjdh sakjhd askjhd aksjhd kjsahd jsk is slow");
});