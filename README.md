# BloodSync Backend

Express and MongoDB backend generated from the model fields in `modelfiles.docx`.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Update `.env` with your MongoDB connection string and JWT secret before starting the server.

## API Routes

| Module | Base route | ID field |
| --- | --- | --- |
| Auth | `/api/auth` | - |
| Donors | `/api/donors` | `donorId` |
| Hospitals | `/api/hospitals` | `hospitalId` |
| Blood requests | `/api/blood-requests` | `requestId` |
| Notifications | `/api/notifications` | `notificationId` |
| Feedback | `/api/feedback` | `feedbackId` |
| Contact us | `/api/contact-us` | `contactId` |
| Login records | `/api/logins` | Mongo `_id` |

Each module route supports:

```text
POST   /
GET    /
GET    /:id
PUT    /:id
DELETE /:id
```

Auth routes:

```text
POST /api/auth/register/donor
POST /api/auth/register/hospital
POST /api/auth/login
```

## Health Check

```text
GET /api/health
```
