from channels.generic.websocket import WebsocketConsumer

class WebsocketHandler(WebsocketConsumer):
	def connect(self):
		self.accept()
		print("AAAAAAAAAAAAA")
	
	def disconnect(self, close_code):
		print("CCCCCCCCCCCCCC")
	
	def receive(self, message):
		print("BBBBBBBBBBBB")
		self.send(text_data=json.dumps({"AAAAA":"received"}))
