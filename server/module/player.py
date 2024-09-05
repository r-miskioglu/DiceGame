from random import randint

class Player():
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.lives = 5
        self.dice = self.roll_dice(self.lives)
        self.moves = [{"amount":0,"number":0}]

    def roll_dice(self, n):
        return [randint(1, 6) for _ in range(n)]
    
    def to_json(self):
        data = {
            "id":self.id,
            "name":self.name,
            "lives":self.lives,
            "dice":self.dice,
            "moves":self.moves
        }
        return data
    
    def load_json(self, data):
        self.id = data['id']
        self.name = data['name']
        self.lives = data['lives']
        self.dice = data['dice']
        self.moves = data['moves']
    
    def last_move(self):
        return self.moves[-1]