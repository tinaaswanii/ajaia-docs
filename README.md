# Ajaia Docs

A lightweight collaborative document editor inspired by Google Docs.

## Live Demo

https://ajaia-docs-ochre.vercel.app/

## GitHub Repository

https://github.com/tinaaswanii/ajaia-docs

---

## Features

- User authentication
- Create and edit documents
- Rich text editor
- Save and reopen documents
- Upload `.txt` and `.md` files
- Share documents with other users
- Separate owned and shared documents
- Persistent storage using Supabase

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- TipTap Editor

### Backend / Database
- Supabase
- PostgreSQL
- Supabase Auth

### Deployment
- Vercel

---

## Test Accounts

### User 1
Email: tina@test.com
Password: password123

### User 2
Email: demo@test.com
Password: password123

---

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/tinaaswanii/ajaia-docs.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env`

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
```

### 4. Run Project

```bash
npm run dev
```

---

## Implemented Features

### Document Editing
- Create documents
- Rename documents
- Rich text formatting
- Save and reopen documents

### File Upload
- Upload `.txt`
- Upload `.md`
- Imported content becomes editable

### Sharing
- Share documents using email
- Shared documents visible under "Shared With Me"

### Persistence
- All documents stored in Supabase
- Sharing state persists after refresh/login

---

## Future Improvements

- Real-time collaboration
- Presence indicators
- Comments
- Version history
- Export to PDF
- Granular permissions
