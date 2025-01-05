from flask_cors import CORS
import os
from flask import Flask, request, jsonify, session
from dotenv import load_dotenv
from groq import Groq
from prompts import system_prompt

# Load environment variable into Flask app
load_dotenv()

app = Flask(__name__)

# Add secret_key for sessions
app.secret_key = os.environ.get('SECRET_KEY') or 'secret_key'

# Added wild card CORS for development purpose
CORS(app)

groq_api_key = os.environ.get('GROQ_API_KEY')
llm_model = os.environ.get('LLM_MODEL') or "llama-3.1-8b-instant"

if not groq_api_key:
    raise RuntimeError("GROQ_API_KEY environment variable is not set.")

groq_client = Groq(api_key=groq_api_key)


@app.route("/")
def home():
    return "llm chat v1.0"


@app.route("/generate-query", methods=["POST"])
def generate_query():
    data = request.form
    user_prompt = data.get("query", "")
    user_name = data.get("name", "")
    if not user_name:
        return jsonify({
            "error": "Missing name in request body"
        }), 400
    if not user_prompt:
        return jsonify({
            "error": "Missing query in request body"
        }), 400
    if user_name not in session:
        session[user_name] = []

    response = query_llm(groq_client, llm_model, user_prompt, user_name)
    return response, 200


system_prompt = {
    "role": "system",
    "content": system_prompt
}


def query_llm(client: Groq, model, user_prompt, user_name):
    prompt = {
        "role": "user",
        "content": user_prompt
    }

    chat_history = session[user_name]

    chat_history.append(prompt)

    messages = [
        system_prompt,
        *chat_history
    ]

    chat_completion = client.chat.completions.create(
        messages=messages,
        model=model,
        response_format={"type": "json_object"},
        temperature=0.2
    )

    response = chat_completion.choices[0].message.content
    chat_history.append({
        "role": "assistant",
        "content": response
    })

    # Delete last two conversation
    if len(chat_history) > 6:
        chat_history.pop(0)
        chat_history.pop(0)

    session[user_name] = chat_history
    session.modified = True
    return response


if __name__ == "__main__":
    app.run(debug=True, port=8000, host="0.0.0.0")
