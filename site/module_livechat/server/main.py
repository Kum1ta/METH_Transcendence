import asyncio
import websockets

connected_clients = set()
validTokens = "123456"

async def handler(websocket, path):
	connected_clients.add(websocket)
	try:
		async for message in websocket:
			for client in connected_clients:
				if client == websocket:
					print(f"Message reçu: {message}")
					if message == validTokens:
						await client.send("Token valide")
					else:
						await client.send("Token invalide")
				if client != websocket:
					await client.send(message)
	except websockets.exceptions.ConnectionClosed as e:
		print(f"Connexion fermée: {e}")
	finally:
		print("Client déconnecté")
		connected_clients.remove(websocket)

start_server = websockets.serve(handler, "localhost", 8000)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()