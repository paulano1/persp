from flask import Flask, request, jsonify
import numpy as np
import pandas as pd

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

user_profile = {
    "userid1": {"left-leaning": 67, "right-leaning": 75, "finance": 89, "sports": 42, "entertainment": 50, "fashion": 12, "travel": 76, "food": 80, "environment": 64, "health": 97},
    "userid2": {"left-leaning": 24, "right-leaning": 18, "finance": 88, "sports": 73, "entertainment": 12, "fashion": 12, "travel": 82, "food": 32, "environment": 41, "health": 32},
    "userid3": {"left-leaning": 88, "right-leaning": 97, "finance": 21, "sports": 53, "entertainment": 50, "fashion": 12, "travel": 76, "food": 41, "environment": 68, "health": 6},
    "userid4": {"left-leaning": 34, "right-leaning": 91, "finance": 90, "sports": 73, "entertainment": 65, "fashion": 12, "travel": 74, "food": 12, "environment": 69, "health": 62},
    "userid5": {"left-leaning": 75, "right-leaning": 58, "finance": 24, "sports": 83, "entertainment": 14, "fashion": 12, "travel": 49, "food": 18, "environment": 30, "health": 57}
}


def read_from_csv(filename):
    df = pd.read_csv(filename, encoding='unicode_escape')
    posts = {}
    #Get the scores for fields: left-leaning, right-leaning, finance, sports, fashion, environment, travel, entertainment, food, health
    for index, row in df.iterrows():
        posts[row['title']] = [row['left-leaning'], row['right-leaning'], row['Finance'], row['Sports'], row['Entertainment'], row['Fashion'], row['Travel'],  row['Food'], row['Environment'],  row['Health']]

    return posts

def get_post_details(post_titles):
    
    #Given a list of post titles, return a list of post details
    post_detail_list = []
    df = pd.read_csv("articles.csv", encoding='unicode_escape')
    for index, row in df.iterrows():
        if row['title'] in post_titles:
            post_details = {}
            post_details['title'] = row['title']
            post_details['description'] = row['description']
            post_details['author'] = row['author']
            post_details['content'] = row['content']
            post_details['url'] = row['url']
            post_details['urlToImage'] = row['urlToImage']
            post_details['topic'] = row['topic']

            post_detail_list.append(post_details)

    

    return post_detail_list


#Recommendation Algorithm for a user
def match_user_posts(user_heuristic):

    posts = read_from_csv("articles.csv")

    user_scores = list(user_heuristic.values())
    cosine_similarities = {}
    for post in posts:
        post_scores = posts[post]
        cosine_similarities[post] = np.dot(user_scores, post_scores)/(np.linalg.norm(user_scores)*np.linalg.norm(post_scores))
    
    res = {key: val for key, val in sorted(cosine_similarities.items(), key = lambda ele: ele[1])}


    post_titles = []
    result = list(res.items())

    for key, value in result[0:15]:
        post_titles.append(key)
    
    for key, value in result[-15:]:
        post_titles.append(key)
    
    posts = get_post_details(post_titles)
    
    print (type(posts))
    print(posts
          )
    
    return posts


    

    
#Matching Algorithm for a user
def match_user(user_id):
    result = ""
    #Get the user's profile
    user = list(user_profile[user_id].values())

    #Get the other users' profiles
    other_users = [list(user_profile[other_user].values()) for other_user in user_profile if other_user != user_id]
    #Calculate the cosine similarity between the user and the other users
    cosine_similarities = [np.dot(user, other_user)/(np.linalg.norm(user)*np.linalg.norm(other_user)) for other_user in other_users]
    #Get the index of the user with the lowest cosine similarity
    min_index = cosine_similarities.index(min(cosine_similarities))
    
    #Return the user ID of the user with the highest cosine similarity
    matched_users_profile = other_users[min_index]

    for key, value in user_profile.items():
        if value == matched_users_profile:
            result = key
            break
    return result


@app.route('/match_users', methods=['POST'])
def match_users_endpoint():
    r_js = request.get_json()
    user_id = r_js['user_id']
    matched_user_id = match_user(user_id)
    return jsonify({'matched_user_id': matched_user_id})

@app.route('/match_user_posts', methods=['POST'])
def match_user_posts_endpoint():
    print("here")
    r_js = request.get_json()
    
    print (r_js)
    user_id = r_js['user_id']
    user_heuristic = user_profile[user_id]
    recommended_posts = match_user_posts(user_heuristic)
    return jsonify(recommended_posts)

if __name__ == '__main__':
    app.run(debug=True, port =8008)
