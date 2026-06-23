# Architecture Note

## Overview

This project is a lightweight collaborative document editor built as a focused product slice inspired by Google Docs.

The goal was to prioritize:
- clean UX
- reliable persistence
- collaborative workflows
- rapid delivery within the assignment scope

---

## Frontend

The frontend was built using:
- React
- Vite
- Tailwind CSS

Rich text editing uses TipTap because it provides:
- clean React integration
- extensible formatting support
- structured JSON content storage

---

## Backend

Supabase was selected because it combines:
- authentication
- PostgreSQL database
- API layer
- row-level security

This reduced backend setup complexity and enabled faster iteration.

---

## Data Model

### documents
Stores:
- title
- content
- owner

### shared_documents
Stores:
- document_id
- shared_with user id

### profiles
Stores:
- user email mapping for sharing

---

## Prioritization Decisions

Focused on:
- stable CRUD flow
- persistence
- sharing
- usable editing experience

Deprioritized:
- real-time collaboration
- comments
- advanced permissions
- operational transforms

These were intentionally scoped out to maintain delivery quality within time constraints.

---

## Deployment

Frontend deployed on Vercel.

Database and authentication hosted on Supabase.
