# API Documentation

## Overview

This API is built using Flask and integrates with the `Groq` service to generate conversational AI responses. It leverages user-specific session storage to maintain chat history. CORS is enabled for cross-origin requests. 

## Environment Variables

The following environment variables are required for the application:

- **`SECRET_KEY`**: Used for Flask session management. Default: `'secret_key'`.
- **`GROQ_API_KEY`**: API key for Groq service (required).
- **`LLM_MODEL`**: Name of the language model to use. Default: `"llama-3.1-8b-instant"`.

## Endpoints

### 1. **Home Endpoint**

#### **`GET /`**

```python
base_url = "http://127.0.0.1:8000"
response = requests.get(base_url)
```

#### Description:
Returns a simple welcome message.

#### Response:
- **200 OK**:
  ```json
  "Welcome"
  ```

---

### 2. **Generate Query**

#### **`POST /generate-query`**

#### Description:
Generates a response from the language model based on the user's query and maintains session-specific chat history.

#### Request Body (Form Data):
| Parameter   | Type   | Required | Description                     |
|-------------|--------|----------|---------------------------------|
| `query`     | string | Yes      | The user's input query.         |
| `name`      | string | Yes      | The user's name for session tracking. |

#### Response:
- **200 OK**:
  Returns the AI-generated response as a JSON string.

  Example:
  ```json
  "What was Apple's profit last year?"
  ```

- **400 Bad Request**:
  If `name` or `query` is missing in the request body.

  Example:
  ```json
  {
    "error": "Missing name in request body"
  }
  ```

#### Chat History:
The server maintains up to 6 most recent interactions (user prompts and assistant responses) for each user. Once the limit is reached, the oldest two messages are removed.

---

## Internal Functions

### `query_llm(client: Groq, model: str, user_prompt: str, user_name: str)`

#### Description:
Handles communication with the Groq API to generate AI responses. Maintains session-specific chat history and enforces a 6-message limit.

#### Parameters:
| Parameter     | Type   | Description                                 |
|---------------|--------|---------------------------------------------|
| `client`      | Groq   | Instance of the Groq client.                |
| `model`       | string | The language model name (e.g., `llama-3.1`).|
| `user_prompt` | string | The user's input query.                     |
| `user_name`   | string | The user's name for session tracking.       |

---

## Setup and Run

### Prerequisites
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Set environment variables in a `.env` file:
   ```env
   SECRET_KEY=your_secret_key
   GROQ_API_KEY=your_groq_api_key
   LLM_MODEL=llama-3.1-8b-instant
   ```

### Run the Application
```bash
python app.py
```

The app will run at `http://0.0.0.0:8000`.

---

## Example Usage

### Request
**Endpoint**: `POST /generate-query`  
**Headers**:  
`Content-Type: application/x-www-form-urlencoded`  

**Body**:
```python
base_url = "http://127.0.0.1:8000"

response = requests.post(
    base_url + '/generate-query',
    data={
     "name": "user_name",
     "query": "Amazon's sale 2020"
    })
```

### Response
**200 OK**:
```json
{
    "success": true,
    "message": null,
    "data": [
        {
            "entity": "Apple",
            "parameter": "profit",
            "startDate": "2023-01-01",
            "endDate": "2023-12-31"
        }
    ]
}
```

---

## Error Handling

- Missing or invalid `GROQ_API_KEY` raises a runtime error during app initialization.
- Missing `name` or `query` in the request body returns a `400` status code with a descriptive error message.

--- 

### Notes:
- The `session` is tied to the `user_name` provided in the request.
- Ensure the Groq API key is valid and the service is accessible for successful operation.

---

### Running with Docker run

```bash
docker compose up
```

### Test

## make sure app is running 
```bash
python test llm_test.py
```