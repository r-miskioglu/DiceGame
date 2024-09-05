from json import dump
from module.player import Player

class Lobby(Player):
    def __init__(self, id, admin):

        self.id = id
        self.players = [admin]
        self.admin_id = admin['id']
        self.start = False

    def add_player(self, player):
        self.players.append(player)

    def remove_player(self, player_id):
        self.players = [item for item in self.players if item["id"] != player_id]

    def to_json(self):
        data = {
            "admin_id": self.admin_id,
            "id": self.id,
            "players":self.players,
            "start":self.start
        }
        return data
    
    def load_json(self, data):
        self.id = data['id']
        self.players = data['players']
        self.admin_id = data['admin_id']
        self.start = data['start']
    
    def save(self):
        f = open('lobbys/'+self.id+'.json', 'w')
        data = self.to_json()
        dump(data,f)
        f.close()