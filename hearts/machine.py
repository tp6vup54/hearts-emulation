import hearts.parser as parser


class StateMachine(object):
    def __init__(self):
        self.current_state = PassingState()

    def change(self):
        self.current_state.change(self)

    def set_state(self, state):
        self.current_state = state


class State(object):
    def __init__(self):
        self.stop_word = ''
        self.parser = None
        self.queued_msg = None

    def change(self, machine):
        pass

    def parse_input(self, msg):
        pass

    def parse_output(self, stream):
        msg = self._fetch_message(stream)
        self.parser.queued_msg = self.queued_msg
        ret = self.parser.parse(msg)
        self.queued_msg = self.parser.queued_msg
        return ret

    def _fetch_message(self, stream):
        msg = []
        while True:
            s = stream.readline()
            msg.append(s)
            if self.stop_word in s:
                break
        return msg


class PassingState(State):
    def __init__(self):
        super(PassingState, self).__init__()
        self.parser = parser.PassingParser()
        self.stop_word = 'Transfer cards:'

    def change(self, machine):
        s = TransferState()
        s.queued_msg = self.queued_msg
        machine.set_state(s)

    def parse_input(self, msg):
        return ' '.join(msg['transfer'])


class TransferState(State):
    def __init__(self):
        super(TransferState, self).__init__()
        self.parser = parser.TransferParser()
        self.stop_word = 'Play cards:'

    def change(self, machine):
        s = PlayingState()
        s.queued_msg = self.queued_msg
        machine.set_state(s)

    def parse_input(self, msg):
        return None


class PlayingState(State):
    def __init__(self):
        super(PlayingState, self).__init__()
        self.parser = parser.PlayingParser()
        self.stop_work = 'Play cards:'

    def change(self, machine):
        machine.set_state(self)

    def parse_input(self, msg):
        return msg['card']

    def parse_output(self, stream):
        if not self.queued_msg:
            return super(PlayingState, self).parse_output(stream)
        else:
            ret = self.queued_msg
            self.queued_msg = None
            return ret
