import asyncio
import websockets

async def send_messages(websocket):
    while True:
        message = input("Enter message to send: ")
        if (websocket.open):
            await websocket.send(message)
        else:
            print("Connection closed")
            break
        print(f"Sent: {message}")

async def receive_messages(websocket):
    while True:
        response = await websocket.recv()
        print(f"Received: {response}")

async def main():
    uri = "ws://localhost:8000"
    async with websockets.connect(uri) as websocket:
        send_task = asyncio.create_task(send_messages(websocket))
        receive_task = asyncio.create_task(receive_messages(websocket))
        await asyncio.gather(send_task, receive_task)

asyncio.run(main())