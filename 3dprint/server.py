# -*- coding: utf-8 -*-

import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from tornado.options import define, options

define("port", default=8890, help="run on the given port", type=int)


class Application(tornado.web.Application):
	def __init__(self):
		handlers = [(r"/", RootHandler), ]
		settings = {
			"static_path": os.path.join(os.path.dirname(__file__), "static")
		}
		tornado.web.Application.__init__(self, handlers, **settings)
		
		# MongoDB
		#self.connection = pymongo.Connection(MONGODB_HOST, MONGODB_PORT)
		#self.db = self.connection["mallertv"]


class BaseHandler(tornado.web.RequestHandler):
	@property
	def db(self):
		return self.application.db


class RootHandler(tornado.web.RequestHandler):
	def get(self):
		self.render("template/index.html", title="3dprint server", items={})
		#result = list(self.db.contents.find({}, limit=1))[0]["_id"]
		#self.write(str("Hello"))


def main():
	tornado.options.parse_command_line()
	http_server = tornado.httpserver.HTTPServer(Application())
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
	main()
