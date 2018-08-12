import subprocess


class HeartAdapter(object):
    def __init__(self):
        python2_path = '~/.pyenv/versions/hearts-cmd/bin/python'
        py_file_path = '~/git/arbeit-intellgence/Hearts/HeartsBasicRule.py'
        self.cmd = '%s %s' % (python2_path, py_file_path)
        self.process = None
        self.parsers = {
            'input': InputParser(),
            'output': OutputParser(),
        }
    
    def communicate(self, command):
        if not self.process:
            self.process = subprocess.Popen(self.cmd.split(), stdout=subprocess.PIPE)
        real_command = self.parsers['input'].parse(command)
        outs, errs = self.process.communicate(real_command)
        print(outs)
        feedback_command = self.parsers['output'].parse(outs)
    
    def parse_input(self, command):
        pass

class Parser(object):
    def parse(self, command):
        pass


class InputParser(Parser):
    def parse(self, command):
        if not command:
            return ''
        k = command.keys()
        return {
            'passing': self.parse_passing,
        }.get(k[0])(command)

    def parse_passing(self, command):
        return ' '.join(command['passing'])


class OutputParser(Parser):
    def parse(self, command):
        if not command:
            return ''
