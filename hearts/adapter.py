import os
import subprocess
from hearts.machine import StateMachine


class HeartAdapter(object):
    def __init__(self):
        python2_path = '/home/sean/.pyenv/versions/hearts-cmd/bin/python'
        py_file_path = '/home/sean/git/arbeit-intellgence/Hearts/HeartsBasicRule.py'
        self.cmd = [python2_path, py_file_path]
        self.process = subprocess.Popen(
                self.cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, universal_newlines=True
            )
        self.machine = StateMachine()

    def input(self, msg):
        content = self.process.stdout.readlines()
        feedback_command = self.parsers['output'].parse(content)
        return feedback_command

    def output(self):
        return self.machine.current_state.parse_output(self.process.stdout)
    
    def __del__(self):
        if self.process:
            self.process.kill()
