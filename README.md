
## **How to use**
1. **Docker Installed**: Ensure Docker is installed. tested on version 27.4.0.
   ```bash
   docker --version
   ```
2. **Docker Compose Installed**: Verify Docker Compose is installed. tested on version v2.31.0-desktop.2
   ```bash
   docker compose version
   ```
3. **Environment Variables**: Create a `.env` file in the same directory as the `docker-compose.yml` file. Add the following environment variables:
   ```env
   GROQ_API_KEY=your_groq_api_key
   LLM_MODEL=your_llm_model
   SECRET_KEY=your_secret_key
   ```

---

## **Steps to Run the Application**

### 1. **Start the Application**
Run the following command to start the containers in detached mode:
```bash
docker compose up -d
```

### 2. **Access the Services**
- **Flask API (Backend):** Accessible at [http://localhost:8000](http://localhost:8000).  
- **Chat UI (Frontend):** Accessible at [http://localhost:3000](http://localhost:3000).

### 3. **View Logs**
To view the logs for both containers, use:
```bash
docker compose logs -f
```

### 4. **Stop the Application**
To stop and remove the running containers, use:
```bash
docker compose down
```

## **Important Notes**
- **Image Compatibility:**  
  The Docker images used (`vishalkale151071/llm-flask-api` and `vishalkale151071/llm-chat-ui`) are built on a **MacOS M1 Silicon** architecture. They might encounter compatibility issues on systems with other architectures (e.g., x86-based systems). If you experience problems, consider rebuilding the images on your system using the respective source code.
