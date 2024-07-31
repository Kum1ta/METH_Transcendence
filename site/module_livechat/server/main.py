import asyncio
import websockets

connected_clients = set()
validTokens = "123456"

async def handler(websocket, path):
	connected_clients.add(websocket)
	try:
		async for message in websocket:
			print(f"Received {message}")
			# for client in connected_clients:
			# 	if client == websocket:
			# 		print(f"Received {message}")
			# 		await websocket.close()
			# 	if client != websocket:
			# 		await client.send(message)
	except websockets.exceptions.ConnectionClosed as e:
		print(f"Connexion fermée: {e}")
	finally:
		print("Client déconnecté")
		connected_clients.remove(websocket)

try:
	start_server = websockets.serve(handler, "localhost", 8000, reuse_address=True)
except OSError as e:
	print(f"Error: {e}")
	exit(1)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()