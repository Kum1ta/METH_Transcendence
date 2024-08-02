from typeRequets.getPrivateListUser import getPrivateListUser
import asyncio
import websockets
import json

connected_clients = set()
userList = [
	{
		"username": "user1",
		"token": "123456",
		"id": 1
	},
	{
		"username": "user2",
		"token": "789123",
		"id": 2
	},
	{
		"username": "user3",
		"token": "456789",
		"id": 3
	}
]

typeRequest = ["get_private_list_user"]
functionRequest = [getPrivateListUser]

async def	sendError(websocket, message, code):
	jsonVar = {"type": "error", "content": message, "code": code}
	await websocket.send(json.dumps(jsonVar))

async def	sendInfoUser(websocket):
	token = websocket.request_headers.get('Sec-WebSocket-Protocol')
	user = [user for user in userList if user['token'] == token][0]
	jsonVar = {"type": "login", "content": user}
	await websocket.send(json.dumps(jsonVar))

async def	isValidToken(websocket):
	token = websocket.request_headers.get('Sec-WebSocket-Protocol')
	# |TOM| Faire une requête à la base de données pour vérifier si le token est valide
	if (token in [user['token'] for user in userList]):
		await sendInfoUser(websocket)
		return True
	else:
		return False

async def	handler(websocket, path):
	if (not await isValidToken(websocket)):
		await websocket.close(reason="Invalid token")
		return
	try:
		async for resquet in websocket:
			try:
				jsonRequest = json.loads(resquet)
			except json.JSONDecodeError:
				await sendError(websocket, "Invalid JSON", 9002)
				continue
			try:
				if (jsonRequest["token"][0] != websocket.request_headers.get('Sec-WebSocket-Protocol')):
					await sendError(websocket, "Invalid token", 9000)
					continue
			except:
				await sendError(websocket, "Token not found", 9001)
				continue
			if (jsonRequest["type"] in typeRequest):
				await functionRequest[typeRequest.index(jsonRequest["type"])](websocket)
			
	except websockets.ConnectionClosed:
		print("Client déconnecté")

start_server = websockets.serve(handler, "localhost", 8000, subprotocols=['123456'])

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()