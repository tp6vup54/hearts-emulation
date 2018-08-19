import json


class Parser(object):
    def __init__(self):
        self.queued_msg = None

    def parse(self, msg):
        pass


class PassingParser(Parser):
    def parse(self, msg):
        parsed_msg = {
            'state': 'passing',
            'cards': {},
        }
        start = msg[-2].find('[')
        end = msg[-2].find(']')
        l = eval(msg[-2][start:end + 1])
        parsed_msg['cards']['first'] = l
        self.queued_msg = l
        return parsed_msg


class TransferParser(Parser):
    def __init__(self):
        super(TransferParser, self).__init__()

    def parse(self, msg):
        parsed_msg = {
            'state': 'transfer',
            'received': [],
            'cards': [],
        }
        playing_parser = PlayingParser()
        passing_parser = PassingParser()
        old_cards = self.queued_msg
        current_cards = passing_parser.parse(msg)['cards']['first']
        self.queued_msg = playing_parser.parse(msg[3:])
        parsed_msg['received'] = self._get_diff_cards(old_cards, current_cards)
        parsed_msg['cards'] = current_cards
        return parsed_msg

    def _get_diff_cards(self, old, cur):
        diff = []
        for i in cur:
            if not i in old:
                diff.append(i)
        return diff


class PlayingParser(Parser):
    def __init__(self):
        super(PlayingParser, self).__init__()
        self.show_action_length = 35
        self.action_length = 11
        self.name_mapping = {
            'NPC01': 'second',
            'NPC02': 'third',
            'NPC03': 'forth',
        }
        self.suit_mapping = {
            1: 's',  # spades
            2: 'h',  # hearts
            4: 'd',  # diamonds
            8: 'c',  # clubs
        }

    def parse(self, msg):
        parsed_msg = {
            'state': 'playing',
            'actions': [],
            'required': {},
        }
        while True:
            if len(msg) > self.show_action_length:
                parsed_msg['actions'].append(self._parse_show_action(msg[:self.show_action_length]))
                msg = msg[self.show_action_length:]
            elif len(msg) > self.action_length:
                parsed_msg['required'] = self._parse_action(msg[:self.action_length])
                msg = msg[self.action_length:]
            else:
                break
        return parsed_msg

    def _parse_show_action(self, msg):
        ret = {
            'name': '',
            'card': '',
        }
        content = json.loads(''.join(msg[-6:]))
        ret['name'] = self.name_mapping.get(list(content['event_data'].keys())[0])
        ret['card'] = list(content['event_data'].values())[0]
        return ret

    def _parse_action(self, msg):
        ret = {
            'type': '',
            'value': '',
        }
        content = json.loads(''.join(msg))
        table = content['event_data']['table']
        if 'required_suit' in table:
            ret['type'] = 'suit'
            ret['value'] = self.suit_mapping.get(table['required_suit'])
        else:
            ret['type'] = 'card'
            ret['value'] = table['required_card']
        return ret
