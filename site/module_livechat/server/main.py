import asyncio
import websockets
import json
import time

connected_clients = set()
validTokens = "123456"

def sendData(websocket):
	while True:
		websocket.send("Heartbeat")
		print("Heartbeat send")
		time.sleep(5)

async def handler(websocket, path):
	print("New client connected to the server")
	if path != "/":
		print("client disconnected")
		await websocket.send(json.dumps({"error": "Invalid path", "code": 9000}))
		await websocket.close()
		return
	connected_clients.add(websocket) 
	try :
		async for message in websocket:
			print(f"Message reçu : {message}")
	except websockets.exceptions.ConnectionClosed as e:
		print("Client disconnected with error :", e)
	sendData(websocket)

try:
	start_server = websockets.serve(handler, "localhost", 8000, reuse_address=True)
except OSError as e:
	print(f"Error: {e}")
	exit(1)
asyncio.get_event_loop().run_until_complete(start_server)
print("Server started")
asyncio.get_event_loop().run_forever()