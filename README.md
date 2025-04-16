
# 🏥 Patient Portal App

The Patient Portal Backend provides an API for patients to access and view their medical reports. It includes support for filtering reports by patient name, data and a in-mem data storage


API's and Backend Provide: 

Report Management: CRUD operations for patient reports
Filtering: Filter reports by patient name, report type, and date
Pagination: Efficient handling of large datasets
Caching: Performance optimization via in-memory caching


Frontend is Organized As: 

Dashboard Overview: View key statistics about reports and recent patient data
Report Management: Browse, filter, and sort medical reports
Detailed Reports: View information about patient reports
Responsive Design: Works on desktop and mobile


---

## Running the App with Docker

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)

---

### ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/patient-portal.git
   cd patient-portal
   ```

2. **Build and run the full stack**
   ```bash
   docker compose up --build
   ```

3. **Access the app**
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:3001/api/v1


3. **Run Tests**
   - Frontend: cd into /frontend
  
  ```bash
   npm run test
   ```

    - Backend: cd into /backend
  
  ```bash
   npm run test
   ```
---

### 🛠 Services Overview

| Service   | Port   | Description                      |
|-----------|--------|----------------------------------|
| frontend  | 3002   | React + Vite UI served via NGINX |
| backend   | 3001   | Express.js API (TypeScript)      |

---

### 🧼 Clean Up

To remove **all containers, images, volumes, and networks**:
```bash
docker system prune -a --volumes
```

To stop the app without deleting resources:
```bash
docker compose down
```

If you need to reseed the database you need to run the command again

```bash
docker compose up --build
```

---

### 📝 Notes

- The frontend expects the backend API at `http://localhost:3001/api/v1`, configured through `VITE_API_BASE_URL`.
- Backend uses an in-memory database. Restarting the container clears all data.

