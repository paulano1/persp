import os
import pymongo
import json
import random
import psycopg2
import time
import requests

def sendsms(tonum, message):


    url = "https://us-central1-aiot-fit-xlab.cloudfunctions.net/sendsms"

    payload = json.dumps({
    "receiver": tonum,
    "message": message,
    "token": "GETUROWN"
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    # print(response.text)


def connector():
    cockroachstring = os.environ.get('COCKROACHSTR')
    conn=psycopg2.connect(cockroachstring)
    return conn



def initialize(conn):
    with conn.cursor() as cur:
        cur.execute(
            "CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY, username STRING, userid STRING, useremail STRING, usertraits STRING, userphone STRING, usergender STRING, userage STRING)"
        )
        cur.execute(
            "CREATE TABLE IF NOT EXISTS chats (id INT PRIMARY KEY, topic STRING, userid STRING,  tags STRING, time STRING)"
        )
        cur.execute(
            "CREATE TABLE IF NOT EXISTS posts (id INT PRIMARY KEY, title STRING, userid STRING, description STRING, content STRING, url STRING, imageurl STRING)"
        )
        cur.execute(
            "CREATE TABLE IF NOT EXISTS messages (id INT PRIMARY KEY, message STRING, userid INT, chatid INT, time STRING, CONSTRAINT fk_usr FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_chat FOREIGN KEY(chatid) REFERENCES chats(id) ON DELETE CASCADE)"
        )
        cur.execute(
            "CREATE TABLE IF NOT EXISTS chatrooms (id INT PRIMARY KEY, userid INT,  chatid INT, time STRING, CONSTRAINT fk_user FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_chat FOREIGN KEY(chatid) REFERENCES chats(id) ON DELETE CASCADE)"
        )        
        # cur.execute("UPSERT INTO users (id, email, userpassword, usertype, name) VALUES (1, 'jon@fisherman.com', 'password1', 'fisherman', 'jon stewart'), (2, 'joe@gmail.com', 'password1', 'customer', 'joe someone')")
        # logging.debug("create_accounts(): status message: %s", cur.statusmessage)
    conn.commit()


def getuserbyuserid(conn, uid):
    with conn.cursor() as cur:
        cur.execute("SELECT id, username, userid, useremail, usertraits, userphone, usergender, userage FROM users")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        for row in rows:
            # print(row)
            # print (type(row))
            if row[2] == uid:
                # print ("found")
                return True, row[0], row[1], row[3], row[4], row[5], row[6], row[7]
        return False, -1, 'none', '-1', '-1', '-1', '-1', '-1' 



def add_chat(conn, userid, topic, tags, time):
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM chats")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        i = 1
        for row in rows:
            i = i + 1
        i = str(i)
        # helperid = "-1"
        status = "created"
        
        cid = i

        cur.execute("UPSERT INTO chats (id, topic, userid, tags, time) VALUES (" + i +", '" + topic +"', '" + userid + "', '" + tags + "', '" + time +"')")
        # logging.debug("create_accounts(): status message: %s", cur.statusmessage)
    conn.commit()

    s, uid, u2, u3, u4, u5, u6, u7 = getuserbyuserid(conn, userid)

    with conn.cursor() as cur:
        cur.execute("SELECT id FROM chatrooms")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        i = 1
        for row in rows:
            i = i + 1
        i = str(i)
        # helperid = "-1"
        status = "created"

        cur.execute("UPSERT INTO chatrooms (id, userid, chatid, time) VALUES (" + i +", '" + str(uid) +"', '" + str(cid) + "', '" + time +"')")
        # logging.debug("create_accounts(): status message: %s", cur.statusmessage)
    conn.commit()


    return str(cid)
    # print ("user added")



def send_message(conn, userid, chatid, message, time):

    s, uid, u2, u3, u4, u5, u6, u7 = getuserbyuserid(conn, userid)

    with conn.cursor() as cur:
        cur.execute("SELECT id FROM messages")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        i = 1
        for row in rows:
            i = i + 1
        i = str(i)
        # helperid = "-1"
        status = "created"
        
        mid = i

        cur.execute("UPSERT INTO messages (id, message, userid, chatid, time) VALUES (" + i +", '" + message +"', '" + str(uid) + "', '" + chatid + "', '" + time +"')")
        # logging.debug("create_accounts(): status message: %s", cur.statusmessage)
    conn.commit()


    return str(mid)



def add_readings(conn, name, ownerid, value, time):
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM readings")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        i = 1
        for row in rows:
            i = i + 1
        i = str(i)
        
        cur.execute("UPSERT INTO readings (id, name, ownerid, value, time) VALUES (" + i +", '" + name + "', '" + ownerid + "', '" + value +"', '" + time +"')")
        # logging.debug("create_accounts(): status message: %s", cur.statusmessage)
    conn.commit()
    return i
    # print ("user added")



def add_users(conn, uname, uid, uphone, uemail, utraits, ugender, uage):
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM users")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # ts = time.time()
        
        # print(f"Balances at {time.asctime()}:")
        i = 1
        for row in rows:
            i = i + 1
        i = str(i)
        

        ##id INT PRIMARY KEY, username STRING, userid STRING, useremail STRING, usertraits STRING, userphone STRING, usergender STRING, userage STRING

        cur.execute("UPSERT INTO users (id, username, userid, useremail, usertraits, userphone, usergender, userage) VALUES (" + i +", '" + uname + "', '" + uid + "', '" + uemail +"', '" + utraits + "', '" + uphone +"', '" + ugender +"', '" + uage +"')")
        # logging.debug("create_accounts(): status message: %s", cur.statusmessage)
    conn.commit()
    return i
    # print ("user added")


def login(conn, uemail, pw):
    with conn.cursor() as cur:
        cur.execute("SELECT id, email, userpassword, userphone, username, lat, lon, useraddress FROM users")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        for row in rows:
            # print(row)
            # print (type(row))
            if row[1] == uemail and row[2] == pw:
                # print ("found")
                return True, row[0], row[3], row[4], row[5], row[6], row[7]
        return False, 'none', 'none', '-1', '-1', '-1', '-1', '-1', '-1' 


def getuserbyid(conn, uid):
    with conn.cursor() as cur:
        cur.execute("SELECT id, email, userpassword, userphone, username, lat, lon, useraddress FROM users")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        for row in rows:
            # print(row)
            # print (type(row))
            if row[0] == int(uid):
                # print ("found")
                return True, row[0], row[1], row[3], row[4], row[5], row[6], row[7]
        return False, 'none', 'none', '-1', '-1', '-1', '-1', '-1', '-1' , '-1'


def getchatbyid(conn, chatid):
# (id, topic, userid, tags, time)
    chat = {}
    with conn.cursor() as cur:
        cur.execute("SELECT id, topic, userid, tags, time FROM chats")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        msgs = []

        for row in rows:
            if str(row[0]) != chatid:
                continue
            
            chat['id'] = row[0]
            chat['topic'] = row[1]
            chat['userid'] = row[2]
            chat['tags'] = row[3]
            chat['time'] = row[4]


        cur.execute("SELECT id, message, userid, chatid, time FROM messages")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()

        for row in rows:
            msg = {}
            if str(row[3]) != chatid:
                continue
            msg['id'] = row[0]
            msg['message'] = row[1]
            msg['userid'] = row[2]
            msg['chatid'] = row[3]
            msg['time'] = row[4]

            msgs.append(msg)

        chat['messages'] = msgs
        
        return chat 



def getreadings(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, name, ownerid, value, time FROM readings")
        # logging.debug("print_balances(): status message: %s", cur.statusmessage)
        rows = cur.fetchall()
        conn.commit()
        # print(f"Balances at {time.asctime()}:")
        readings = []

        for row in rows:
            place = {}
            place['id'] = row[0]
            place['name'] = row[1]
            place['ownerid'] = row[2]
            place['value'] = row[3]
            place['time'] = row[4]


            readings.append(place)

        return readings 


def delete_users(conn):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM hackabull2023.users")
        # logging.debug("delete_accounts(): status message: %s", cur.statusmessage)
    conn.commit()
    with conn.cursor() as cur:
        cur.execute("DROP TABLE users")
        # logging.debug("delete_accounts(): status message: %s", cur.statusmessage)
    conn.commit()

    print ("users table deleted")


def purgedb(conn):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM defaultdb.users")
        # logging.debug("delete_accounts(): status message: %s", cur.statusmessage)
    conn.commit()
    with conn.cursor() as cur:
        cur.execute("DROP TABLE users")
        # logging.debug("delete_accounts(): status message: %s", cur.statusmessage)
    conn.commit()

    print ("users table deleted")



def dummy(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    if request.method == 'OPTIONS':
        # Allows GET requests from origin https://mydomain.com with
        # Authorization header
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Credentials': 'true'
        }
        return ('', 204, headers)

    # Set CORS headers for main requests
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    }



    request_json = request.get_json()
    conn = connector()
    initialize(conn)

    retjson = {}

    action = request_json['action']

    if action == "donothing":

        retjson['status'] = "successfully  initialized - no action taken"

        return json.dumps(retjson)       


    if action == "createuser" :
        uname = request_json['name']
        uid = request_json['userid']
        uphone = request_json['phone']
        uemail = request_json['email']
        ugender = request_json['gender']
        utraits = json.dumps(request_json['traits'])
        uage = str(request_json['age'])

        ##add_users(conn, uname, uid, uphone, uemail, utraits, ugender, uage)

        pid = add_users(conn, uname, uid, uphone, uemail, utraits, ugender, uage)

        retjson['status'] = "successfully added"
        retjson['userdbid'] = pid

        return json.dumps(retjson)


    if action == "createchat" :
        topic = request_json['topic']
        userid = request_json['userid']
        tags = json.dumps(request_json['tags'])
        ts = str(int(time.time()))

        # add_chat(conn, userid, topic, tags, time)

        cid = add_chat(conn, userid, topic, tags, ts)

        retjson['status'] = "successfully added"
        retjson['chatdbid'] = cid

        return json.dumps(retjson)


    if action == "sendmessage":

        # send_message(conn, userid, chatid, message, time)

        message = request_json['message']
        userid = request_json['userid']
        chatid = request_json['chatid']
        ts = str(int(time.time()))

        mid = send_message(conn, userid, chatid, message, ts)
        
        retjson['status'] = "successfully added"
        retjson['msgdbid'] = mid

        return json.dumps(retjson)
    
    if action == "getchat":
    # getchatbyid(conn, chatid)
        chatid = request_json['chatid']

        chat = getchatbyid(conn, chatid)

        retjson['status'] = "successfully retrieved"
        retjson['chat'] = chat

        return json.dumps(retjson)        


    if action == "addreading" :
        name = request_json['name']
        ownerid = request_json['ownerid']
        value = request_json['value']
        times = request_json['time']


        pid = add_readings(conn, name, ownerid, value, time)

        retjson['status'] = "successfully added"
        retjson['id'] = pid

        return json.dumps(retjson)


  

    if action == 'login':
        uemail = request_json['email']
        pw = request_json['password']

        res = login(conn, uemail, pw)

        retjson['status'] = str(res[0])
        retjson['id'] = str(res[1])
        retjson['type'] = str(res[2])
        retjson['name'] = str(res[3])
        retjson['lat'] = str(res[4])
        retjson['lon'] = str(res[5])
        retjson['address'] = str(res[6])
        

        return json.dumps(retjson)



    if action == 'getuserbyid':
        uid = request_json['uid']

        res = getuserbyid(conn, uid)

        retjson['status'] = str(res[0])
        retjson['id'] = str(res[1])
        retjson['email'] = str(res[2])
        retjson['type'] = str(res[3])
        retjson['name'] = str(res[4])
        retjson['lat'] = str(res[5])
        retjson['lon'] = str(res[6])
        retjson['address'] = str(res[7])
        

        return json.dumps(retjson)


    retstr = "action not done"

    if request.args and 'message' in request.args:
        return request.args.get('message')
    elif request_json and 'message' in request_json:
        return request_json['message']
    else:
        return retstr
