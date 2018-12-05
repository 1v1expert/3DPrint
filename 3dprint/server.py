# -*- coding: utf-8 -*-

import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from config import config
from tornado.options import define, options
import json

define("port", default=config.PORT, help="run on the given port", type=int)


class Application(tornado.web.Application):
	def __init__(self):
		handlers = [(r"/", RootHandler), ]
		settings = {
			"cookie_secret": config.cookie_secret,
			"static_path": os.path.join(os.path.dirname(__file__), "static")
		}
		tornado.web.Application.__init__(self, handlers, **settings)


class RootHandler(tornado.web.RequestHandler):
	def get(self):
		FULL_DATA = dict(config=config.CONFIG, Definition=config.Definition)
		self.render("template/index.html", title="3dprint server", config=json.dumps(FULL_DATA))


def main():
	tornado.options.parse_command_line()
	http_server = tornado.httpserver.HTTPServer(Application())
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
	main()
