## Backend (FastAPI)

### Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS and Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run tests:
   ```
   pytest
   ```

6. Run the server:
   ```
   python -m uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`.

## Frontend (Angular)

### Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run tests:
   ```
   ng test
   ```
    or
   ```
   npm run test
   ```

4. Run the development server:
   ```
   ng serve
   ```
    or
   ```
   npm start
   ```

The application will be available at `http://localhost:4200`.

## API Endpoints

- `GET /api/todos`: Retrieve all todos
- `POST /api/todos`: Create a new todo
- `GET /api/todos/{id}`: Retrieve a specific todo
- `PUT /api/todos/{id}`: Update a specific todo
- `DELETE /api/todos/{id}`: Delete a specific todo