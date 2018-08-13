import os
import time
import fcntl
import hashlib
import subprocess


class HeartAdapter(object):
    def __init__(self):
        python2_path = '/home/sean/.pyenv/versions/hearts-cmd/bin/python'
        py_file_path = '/home/sean/git/arbeit-intellgence/Hearts/HeartsBasicRule.py'
        self.cmd = [python2_path, py_file_path]
        self.process = None
        self.parsers = {
            'input': InputParser(),
            'output': OutputParser(),
        }

    def communicate(self, command=None):
        if not self.process:
            self.process = subprocess.Popen(
                self.cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, universal_newlines=True)
            flags = fcntl.fcntl(self.process.stdout, fcntl.F_GETFL)
            fcntl.fcntl(self.process.stdout, fcntl.F_SETFL, flags | os.O_NONBLOCK)
        real_command = self.parsers['input'].parse(command)
        if real_command:
            self.process.stdin.writelines(real_command)
        time.sleep(0.6)
        content = self.process.stdout.readlines()
        feedback_command = self.parsers['output'].parse(content)
        return feedback_command
    
    def parse_input(self, command):
        pass

    def __del__(self):
        if self.process:
            self.process.kill()


class Parser(object):
    def parse(self, command):
        pass


class InputParser(Parser):
    def parse(self, command):
        if not command:
            return None
        k = command.keys()
        return {
            'passing': self.parse_passing,
        }.get(k[0])(command)

    def parse_passing(self, command):
        return ' '.join(command['passing'])


class OutputParser(Parser):
    def __init__(self):
        self.keywords = {
            '2b44258ae4b9c8e7a0097ecce5274d1560d2a9b6': self.parse_passing,
        }
    def parse(self, command):
        if not command:
            return None
        digest = hashlib.sha1(command[-1].encode()).hexdigest()
        if digest in self.keywords:
            return self.keywords[digest](command)

    def parse_passing(self, command):
        ret = {
            'stage': 'passing',
            'cards': {},
        }
        start = command[0].find('[')
        end = command[0].find(']')
        l = eval(command[0][start:end + 1])
        c = ret['cards']
        c['first'] = l
        return ret
