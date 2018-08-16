import os
import json
from tornado import ioloop, web, websocket, concurrent
from concurrent.futures import ThreadPoolExecutor

from hearts.adapter import HeartAdapter

content = None
meta_logs_map = {}


class Index(web.RequestHandler):
    def get(self):
        self.render('build/index.html')


class SocketManager(object):
    connections = []

    @classmethod
    def add_connection(cls, socket):
        cls.connections.append(socket)

    @classmethod
    def remove_connection(cls, socket):
        cls.connections.remove(socket)


class Action(websocket.WebSocketHandler):
    def open(self):
        print('Open action socket.')
        self.adapter = HeartAdapter()
        msg = self.adapter.output()
        print(msg)
        self.write_message(msg)

    def on_close(self):
        print('Close action socket.')
        if self.adapter:
            del self.adapter

    def on_message(self, message):
        print(message)
        # self.write_message(content.get(key))


class UploadLog(web.RequestHandler):
    executor = ThreadPoolExecutor(os.cpu_count())

    async def post(self):
        print(self.request.files)
        try:
            file_list = list(self.request.files.values())[0]
            for f in file_list:
                await self.write_log_file(f)
                GetNewLogUploaded.update_log_message(f['filename'])
        except Exception as e:
            print('Get exception: %s' % e)

    @concurrent.run_on_executor
    def write_log_file(self, f):
        print('Get %s.' % f['filename'])
        with open('battle-log/%s' % f['filename'], 'wb') as fh:
            fh.write(f['body'])


settings = {
    'autoreload': True,
}


if __name__ == '__main__':
    app = web.Application([
        (r'/', Index),
        (r'/action', Action),
        (r'/build/(.*)', web.StaticFileHandler, {'path': './build'}),
        (r'/img/(.*)', web.StaticFileHandler, {'path': './assets/img'}),
    ], **settings)
    app.listen(3000)
    ioloop.IOLoop.current().start()
