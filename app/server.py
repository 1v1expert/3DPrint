# -*- coding: utf-8 -*-

import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from config import config
from tornado.options import define, options
import json
from shutil import copy2
import tornado.escape

define("port", default=config.PORT, help="run on the given port", type=int)


class Application(tornado.web.Application):
	def __init__(self):
		handlers = [(r"/", RootHandler),
		            (r"/manage_file", FileManager)]
		settings = {
			"cookie_secret": config.cookie_secret,
			"static_path": os.path.join(os.path.dirname(__file__), "static")
		}
		tornado.web.Application.__init__(self, handlers, **settings)


class FileManager(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self, *args, **kwargs):
		self.write(json.dumps({'files': self.get_files()}))
		self.finish()
		
	def post(self, *args, **kwargs):
		if self.parse_body(self.request.body):
			self.write(json.dumps({'Result': 'success'}))
		else:
			self.write_error(404)
		
	def parse_body(self, body):
		try:
			p_body = tornado.escape.json_decode(body)
			command = p_body.get('command', None)
			if command:
				method = getattr(self, command + '_file')
				method(p_body.get('path'), p_body.get('name'))
		except:
			return False
	
	@staticmethod
	def copy_file(src, name):
		copy2(src, config.FileManager['Destination'] + '/' + name)
	
	@staticmethod
	def get_files():
		files = []
		for root, directories, filenames in os.walk(config.FileManager['Source']):
			for filename in filenames:
				if filename.endswith(config.FileManager['Suffix']):
					files.append({'path': root + '/' + filename,
					              'name': filename})
				#print(filename.endswith('xml'))
				os.path.join(root, filename)
		return files


class RootHandler(tornado.web.RequestHandler):
	def get(self):
		FullData = dict(
			config=config.CONFIG,
			Definition=config.Definition,
			buttons=config.buttons, translate_state=config.translate_state)
		self.render("template/index.html", title="3dprint server", config=json.dumps(FullData))

def main():
	tornado.options.parse_command_line()
	http_server = tornado.httpserver.HTTPServer(Application())
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
	main()
