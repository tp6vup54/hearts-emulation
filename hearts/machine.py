class StateMachine(object):
    def __init__(self):
        self.current_state = PassingState()

    def set_state(self):
        self.current_state.change(self)


class State(object):
    def change(self, machine):
        pass

    def parse_input(self, msg):
        pass

    def parse_output(self, stream):
        pass


class PassingState(State):
    def change(self, machine):
        machine.set_state()

    def parse_input(self, msg):
        return ' '.join(msg['transfer'])

    def parse_output(self, stream):
        msg = []
        ret = {
            'state': 'passing',
            'cards': {},
        }
        while True:
            s = stream.readline()
            msg.append(s)
            if 'Transfer cards:' in s:
                break
        start = msg[-2].find('[')
        end = msg[-2].find(']')
        l = eval(msg[-2][start:end + 1])
        c = ret['cards']
        c['first'] = l
        return ret
