# API Documentation Specification

This document details the REST API endpoints for **Food Rescue Connect (RescueConnect)**, defined in OpenAPI-style JSON and Markdown.

---

## Authentication & Session Management

### 1. Register User Account
*   **Endpoint:** `POST /api/auth/register`
*   **Description:** Creates a new account with custom role assignment.
*   **Request Headers:** `Content-Type: application/json`
*   **Request Body:**
```json
{
  "email": "canteen@apexcollege.edu",
  "password": "SecurePassword123",
  "name": "Apex Student Canteen",
  "role": "donor",
  "phone": "+919876543210"
}
```
*   **Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "User registered successfully.",
  "data": {
    "user_id": "8a3d4f12-08f3-4ea2-b883-fae3221b6d21",
    "email": "canteen@apexcollege.edu",
    "name": "Apex Student Canteen",
    "role": "donor",
    "points": 0,
    "level": 1
  }
}
```

### 2. Login User
*   **Endpoint:** `POST /api/auth/login`
*   **Description:** Authenticates credentials and yields a secure JWT session token.
*   **Request Body:**
```json
{
  "email": "canteen@apexcollege.edu",
  "password": "SecurePassword123"
}
```
*   **Success Response (200 OK):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": "8a3d4f12-08f3-4ea2-b883-fae3221b6d21",
    "name": "Apex Student Canteen",
    "role": "donor",
    "points": 450
  }
}
```

---

## Food Safety & Image Analysis

### 3. Analyze Food Image & Freshness
*   **Endpoint:** `POST /api/safety/analyze`
*   **Description:** Evaluates food images and predicts quality safety scores.
*   **Request Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
*   **Request Body:** (Form file upload under key `image`)
*   **Success Response (200 OK):**
```json
{
  "status": "success",
  "analysis": {
    "category": "Catered Hot Meals",
    "qty_servings": 45,
    "freshness_score": 94.20,
    "consumption_window_hours": 8,
    "redistribution_status": "APPROVED",
    "hazard_warnings": "Freshly prepared. Store in temperature-insulated vessels."
  }
}
```

---

## Donations & Proximity Matching

### 4. Create Donation Item
*   **Endpoint:** `POST /api/donations`
*   **Description:** Publishes a new surplus food opportunity into the regional queue.
*   **Request Headers:** `Authorization: Bearer <token>`
*   **Request Body:**
```json
{
  "title": "Canteen Rice Surplus",
  "category": "Catered Hot Meals",
  "scale": "event_bulk",
  "quantity_description": "20kg Veg Biryani",
  "quantity_meals": 45,
  "freshness_score": 94.20,
  "consumption_window_hours": 8,
  "latitude": 12.9716,
  "longitude": 77.5946
}
```
*   **Success Response (201 Created):**
```json
{
  "status": "success",
  "donation_id": "5f1a3e89-10b2-4d2c-91e8-782a15c32d94"
}
```

### 5. Smart NGO Recommendations
*   **Endpoint:** `GET /api/donations/:id/recommendations`
*   **Description:** Ranks nearest shelter organizations according to proximity and capacities.
*   **Success Response (200 OK):**
```json
{
  "status": "success",
  "recommendations": [
    {
      "org_id": "22e1b43f-7c18-4e89-91ca-52b39f1c7e92",
      "name": "Asha Orphanage Shelter",
      "distance_km": 1.2,
      "estimated_travel_mins": 5,
      "match_score": 98.5
    }
  ]
}
```

---

## Volunteer & Verification Systems

### 6. Claim Rescue Job
*   **Endpoint:** `POST /api/rescue/claims`
*   **Description:** Assigns an active volunteer rider to an active matched route.
*   **Request Body:**
```json
{
  "donation_id": "5f1a3e89-10b2-4d2c-91e8-782a15c32d94",
  "ngo_id": "22e1b43f-7c18-4e89-91ca-52b39f1c7e92"
}
```
*   **Success Response (200 OK):**
```json
{
  "status": "success",
  "match_id": "7b8a9c1d-12e3-4f56-789a-012bc34de56f",
  "verification_qr_payload": "RESCUE_VERIFY_7b8a9c1d"
}
```

### 7. QR Verify Delivery Completion
*   **Endpoint:** `POST /api/rescue/verify`
*   **Description:** Scans secure QR payload, marks delivery as complete, triggers points triggers.
*   **Request Body:**
```json
{
  "match_id": "7b8a9c1d-12e3-4f56-789a-012bc34de56f",
  "qr_payload": "RESCUE_VERIFY_7b8a9c1d"
}
```
*   **Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Delivery verified successfully. 150 points awarded to rider Sam.",
  "user_points": 600,
  "user_level": 4
}
```
