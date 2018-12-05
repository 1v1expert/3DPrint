# -*- coding: utf-8 -*-

import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from config import config
from tornado.options import define, options

define("port", default=config.PORT, help="run on the given port", type=int)


class Application(tornado.web.Application):
	def __init__(self):
		handlers = [(r"/", RootHandler), ]
		settings = {
			"static_path": os.path.join(os.path.dirname(__file__), "static")
		}
		tornado.web.Application.__init__(self, handlers, **settings)


class BaseHandler(tornado.web.RequestHandler):
	@property
	def db(self):
		return self.application.db


class RootHandler(tornado.web.RequestHandler):
	def get(self):
		self.render("template/index.html", title="3dprint server", items={})


def main():
	tornado.options.parse_command_line()
	http_server = tornado.httpserver.HTTPServer(Application())
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
	main()
