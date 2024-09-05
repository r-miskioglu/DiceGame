from flask import Flask, jsonify, request, session
from flask_cors import CORS
import json
import random
import string
import os

from module.lobby import Lobby
from module.player import Player
from module.game import Game

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
cors = CORS(app, supports_credentials=True)
app.config.update(
    SESSION_COOKIE_SAMESITE='None',  # Required for cross-site cookies
    SESSION_COOKIE_SECURE=True,      # Required for HTTPS
)

def generate_random_string(length):
    characters = string.ascii_letters + string.digits  # Buchstaben (klein und groß) + Ziffern
    return ''.join(random.choice(characters) for _ in range(length))

def load_lobby(id):
    path = 'lobbys/'+id+'.json'
    if os.path.exists(path):    
        f = open('lobbys/'+id+'.json', 'r')
        data = json.load(f)
        f.close()
        return data, 200
    else:
        return {"error":"Lobby doesnt exist"}, 400

def load_game(id):
    path = 'games/'+id+'.json'
    if os.path.exists(path):    
        f = open('games/'+id+'.json', 'r')
        data = json.load(f)
        f.close()
        return data, 200
    else:
        return {"error":"Game doesnt exist"}, 400

def create_lobby_id():
    id = generate_random_string(4)
    path = 'lobbys/' + id + '.json' 
    if os.path.exists(path):
        create_lobby_id()
    else:
        return id

def create_game_id():
    id = generate_random_string(4)
    path = 'games/' + id + '.json' 
    if os.path.exists(path):
        create_game_id()
    else:
        return id

def create_player_id():
    #check if player_id exists already
    return generate_random_string(4)

def validate_request(r, expected_keys):

    if not r.is_json:
        return {"error": "Invalid format, JSON expected"}, 400
    
    data = r.get_json()

    if not all(key in data for key in expected_keys):
        return {"error": "Missing keys in request data"}, 400
    
    return {"error":None}, 200

def create_game(lobby):
    #create Game
    game = Game(lobby=lobby)
    game.save()

def get_last_move(game_state):
    turn = game_state['state']
    players_amount = len(game_state['players'])
    if(turn == 0):
        last_turn = players_amount - 1
    else:
        last_turn = turn - 1
    last_move = game_state['players'][last_turn]['moves'][-1]
    return last_move

def check_validity(game_state, new_amount, new_number):

    last_move = get_last_move(game_state)

    last_amount = int(last_move['amount'])
    last_number = int(last_move['number'])

    if(new_amount > last_amount):
        if(new_number in range(2,7)):
            return {"message":"valid move"}, 200
        else:
            return {"error":"new number is not in [2, 6]"}, 400
    elif(new_amount == last_amount):
        if(new_number in range(2,7)):
            if(new_number > last_number):
                return {"message":"valid move"}, 200
            else:
                return {"error":"new number is not greater then last number"}, 400
        else:
            return {"error":"new number is not in [2, 6]"}, 400
        
    elif(new_amount < last_amount):
        return {"error":"new amount is not greater then last amount"}, 400
    else:
        return {"error":"idk what the fuck went wrong here"}, 400

@app.route("/api/getlobby", methods=['GET'])
def getlobby():

    if 'lobby_id' not in session:
        return jsonify({"error":"you havent joined or created a lobby"})
    
    lobby, code = load_lobby(session['lobby_id'])

    if code == 400:
        return jsonify(lobby), code
    else:
        lobby['local_id'] = session['player_id']
        return jsonify(lobby)

@app.route("/api/create_lobby", methods=['POST'])
def create_lobby():

    #validate request

    error, code = validate_request(request, ['player_name'])
    if code == 400:
        return error
    
    data = request.get_json()
    #create ID's
    lobby_id = create_lobby_id()
    player_id = create_player_id()

    #set Session for identification
    session['player_id'] = player_id
    session['lobby_id'] = lobby_id

    #create Player
    player = Player(id=player_id, name=data['player_name'])

    #create Lobby
    lobby = Lobby(id=lobby_id, admin=player.to_json())
    lobby.save()

    return jsonify({"message":"lobby created successfully", "id":lobby_id})

@app.route("/api/join_lobby", methods=['POST'])
def join_lobby():
    #validate request
    error, code = validate_request(request, ['lobby_id', 'player_name'])
    if code == 400:
        return error, code

    data = request.get_json()

    lobby_dict, code = load_lobby(data['lobby_id'])

    if code == 400:
        return lobby_dict, code

    player_id = create_player_id()
    session['player_id'] = player_id
    session['lobby_id'] = data['lobby_id']

    player = Player(id=player_id, name=data['player_name'])
    lobby = Lobby(id=0,admin=player.to_json())
    lobby.load_json(lobby_dict)
    lobby.add_player(player.to_json())
    lobby.save()

    return jsonify({"message":"successfully added "+data['player_name']+" to the lobby"})

@app.route("/api/leave_lobby", methods=['POST'])
def leave_lobby():

    try:
        player_id = session['player_id']
        session_id = session['lobby_id']
    except:
        return jsonify({"error":"session not found"}), 400
    

    lobby_dict, code = load_lobby(session_id)

    if code == 400:
        return jsonify(lobby_dict), code
    
    try:
        player_id = session['player_id']
    except:
        return jsonify({"error":"session not found"}), 400
    
    player = Player(id=0, name="")
    lobby = Lobby(id=0,admin=player.to_json())
    lobby.load_json(lobby_dict)
    lobby.remove_player(player_id)
    lobby.save()

    return jsonify({"message":"successfully removed from the lobby"})

@app.route("/api/kick_lobby", methods=['POST'])
def kick_lobby():

    try:
        player_id = session['player_id']
        session_id = session['lobby_id']
    except:
        return jsonify({"error":"session not found"}), 400
    
    error, code = validate_request(request, ['player_id'])
    if code == 400:
        return error, code

    data = request.get_json()

    lobby_dict, code = load_lobby(session_id)

    if code == 400:
        return jsonify(lobby_dict), code
    
    try:
        player_id = session['player_id']
    except:
        return jsonify({"error":"session not found"}), 400
    
    player = Player(id=0, name="")
    lobby = Lobby(id=0,admin=player.to_json())
    lobby.load_json(lobby_dict)

    if(lobby.admin_id != player_id):
        return jsonify({"eror":"your somehow not the admin"}), 400
    
    lobby.remove_player(data['player_id'])
    lobby.save()

    return jsonify({"message":"successfully removed from the lobby"})

@app.route("/api/start_lobby", methods=['POST'])
def start_lobby():

    lobby_dict, code = load_lobby(session['lobby_id'])

    if code == 400:
        return jsonify(lobby_dict), 400
    player = Player(id="", name="")
    lobby = Lobby(id="0",admin=player.to_json())
    lobby.load_json(lobby_dict)
    lobby.start = True;
    lobby.save()
    print(lobby.to_json())
    lobby_dict = lobby.to_json()
    print(lobby_dict['players'])
    create_game(lobby_dict)
    
    return jsonify({"message":"Lobby Started"})

@app.route("/api/get_game", methods=['GET'])
def get_lobby():

    if 'lobby_id' not in session:
        return jsonify({"error":"you havent joined or created a lobby"})
    
    game, code = load_game(session['lobby_id'])

    if code == 400:
        return jsonify(game), code
    else:
        game['local_id'] = session['player_id']
        return jsonify(game)

@app.route("/api/submitmove", methods=['POST'])
def submitmove():

    error, code = validate_request(request, ["amount", "number"])
    if code == 400:
        return error, code
    
    data = request.get_json()

    try:
        game_id = session['lobby_id']
        player_id = session['player_id']
    except:
        return jsonify({"error":"Session not Found"}), 400
    
    game_json, code = load_game(game_id)
    if code == 400:
        return jsonify(game_json), code

    new_amount = data['amount']
    new_number = data['number']

    error, code = check_validity(game_state=game_json, new_amount=new_amount, new_number=new_number)
    if code == 400:
            return error, code
    
    #create Empty Game
    player = Player(id="player_id", name='player_name')
    player_json = player.to_json()
    lobby = Lobby(id="lobby_id", admin=player_json)
    lobby_json = lobby.to_json()
    game = Game(lobby=lobby_json)
    game.load_json(game_json)
    current_player_id = game.find_player_index(player_id)
    if game.state != current_player_id: 
        return jsonify({"error":"it's not your turn"}), 400
        
    game.submit_move(player_id, data)
    game.save()

    return jsonify({"message":"move submited"})

@app.route("/api/submit_doubt", methods=['POST'])
def submit_doubt():
    error, code = validate_request(request, ["move"])
    if code == 400:
        return error, code
    
    data = request.get_json()

    try:
        game_id = session['lobby_id']
    except:
        return jsonify({"error":"Session not Found"}), 400
    
    game_json, code = load_game(game_id)
    if code == 400:
        return jsonify(game_json), code
    
    #create Empty Game
    player = Player(id="player_id", name='player_name')
    lobby = Lobby(id="lobby_id", admin=player.to_json())
    lobby_json = lobby.to_json()
    game = Game(lobby=lobby_json)
    game.load_json(game_json)

    actual_amount, loser_index = game.doubt()
    game.save()
    return jsonify({"actual_amount":actual_amount, "loser_index":loser_index})

@app.route("/api/leave_game", methods=['POST'])
def leave_game():

    try:
        game_id = session['lobby_id']
        player_id = session['player_id']
    except:
        return jsonify({"error":"Session not Found"}), 400
    
    game_json, code = load_game(game_id)
    if code == 400:
        return jsonify(game_json), code
    
    player = Player(id="player_id", name='player_name')
    player_json = player.to_json()
    lobby = Lobby(id="lobby_id", admin=player_json)
    lobby_json = lobby.to_json()
    game = Game(lobby=lobby_json)
    game.load_json(game_json)
    game.remove_player(player_id)
    game.save()

    return jsonify({"message":"succes"})

if __name__ == "__main__":
    app.run(debug=True, port=8080)