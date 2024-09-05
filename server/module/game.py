from module.player import Player
from json import dump

class Game(Player):
    def __init__(self, lobby):
        super().__init__(id="", name="")
        self.id = lobby['id']
        self.players = self.players_from_json(lobby['players'])
        self.state = 0
        self.dice_in_game = self.get_dice_in_game()

    def get_dice_in_game(self):
        d = 0
        for player in self.players:
            d = d + len(player.dice)
        return d

    def doubt(self):

        all_dice = []
    
        for player in self.players:
            all_dice.extend(player.dice)
        
        last_call = self.players[self.state-1].moves[-1]
        called_amount = int(last_call['amount'])
        called_number = int(last_call['number'])

        actual_amount = all_dice.count(called_number) + all_dice.count(1)

        if(called_amount >= actual_amount):
            loser_index = self.state
        else:
            if self.state == 0:
                loser_index = len(self.players) - 1
            else:
                loser_index = self.state - 1

        if self.players[loser_index].lives > 1:
            self.players[loser_index].lives -= 1
        else:
            self.remove_player(loser_index)

        for player in self.players:
            player.roll_dice(player.lives())

        self.dice_in_game = self.get_dice_in_game()

        return actual_amount, loser_index


    def remove_player(self, id):
        ind = self.find_player_index(id)
        del self.players[ind]

    def submit_move(self, p_id, move):

        #maybe check server side if move is valid

        index = self.find_player_index(p_id)

        self.players[index].moves.append(move)
        print(self.state, len(self.players) - 1)
        if(self.state >= len(self.players) - 1):
            print("ist passiert")
            self.state = 0
        else:
            self.state += 1
        print(self.state)
    
    def find_player_index(self, p_id):

        for i, p in enumerate(self.players):
            if p.id == p_id:
                return i
        return None
    
    def players_from_json(self, players):
        ps = []
        for player_data in players:
            p = Player(id=player_data['id'], name=player_data['name'])
            p.load_json(player_data)
            ps.append(p)
        return ps
    
    def players_to_json(self, players):
        ps = []
        for player in players:
            ps.append(player.to_json())
        return ps
    
    def to_json(self):
        data = {
            "id":self.id,
            "players":self.players_to_json(self.players),
            "state":self.state
        }
        return data
    
    def load_json(self, data):
        self.id = data['id']
        self.players = self.players_from_json(data['players'])
        self.state = data['state']

    def save(self):
        f = open('games/'+self.id+'.json', 'w')
        data = self.to_json()
        dump(data,f)
        f.close()