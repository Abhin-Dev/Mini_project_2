# RootConnect Backend - Guide Registration API

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/rootconnect
# For MongoDB Atlas (cloud), use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rootconnect?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (if using authentication)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Guide Registration
- **POST** `/api/guides/register` - Register a new guide
- **GET** `/api/guides` - Get all guides (with optional filtering)
- **GET** `/api/guides/:id` - Get guide by ID
- **PUT** `/api/guides/:id` - Update guide
- **DELETE** `/api/guides/:id` - Delete guide

## Example Requests

### Register a Guide
```bash
curl -X POST http://localhost:5000/api/guides/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York",
    "languages": ["English", "Spanish"],
    "experience": 5,
    "bio": "Experienced tour guide with 5 years of experience",
    "profileImage": "https://example.com/profile.jpg"
  }'
```

### Get All Guides
```bash
curl http://localhost:5000/api/guides
```

### Search Guides by Location
```bash
curl "http://localhost:5000/api/guides?location=New York"
```

### Search Guides by Language
```bash
curl "http://localhost:5000/api/guides?language=Spanish"
```

### Search Guides by Name
```bash
curl "http://localhost:5000/api/guides?name=John"
```

## Response Format

All responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": [...],
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Optional validation errors"]
}
```
