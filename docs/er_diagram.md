# Entity Relationship (ER) Diagram

Below is the conceptual and logical Entity-Relationship diagram for the **Food Rescue Ecosystem (RescueConnect)** database schema, drafted in Mermaid syntax.

```mermaid
erDiagram
    USERS ||--o| ORGANIZATIONS : "registers/manages"
    USERS ||--o{ DONATIONS : "declares"
    USERS ||--o{ RESCUE-MATCHES : "delivers (volunteer)"
    USERS ||--o{ CHAT-LOGS : "sends"
    USERS ||--o{ SYSTEM-AUDIT-LOGS : "triggers"
    
    ORGANIZATIONS ||--o{ RESCUE-MATCHES : "receives"
    ORGANIZATIONS ||--o{ COMMUNITY-SHORTAGES : "reports"
    
    DONATIONS ||--o| RESCUE-MATCHES : "matched_in"
    
    RESCUE-MATCHES ||--o{ CHAT-LOGS : "houses"

    USERS {
        uuid user_id PK
        string email UK
        string password_hash
        string name
        enum role
        string phone
        int points
        int level
        timestamp created_at
    }

    ORGANIZATIONS {
        uuid org_id PK
        uuid user_id FK
        string name
        string type
        string registration_no UK
        text address
        decimal latitude
        decimal longitude
        boolean is_verified
        int capacity
    }

    DONATIONS {
        uuid donation_id PK
        uuid donor_id FK
        string title
        string category
        enum scale
        int quantity_meals
        decimal freshness_score
        int consumption_window_hours
        enum status
        decimal latitude
        decimal longitude
        timestamp expires_at
    }

    RESCUE-MATCHES {
        uuid match_id PK
        uuid donation_id FK
        uuid volunteer_id FK
        uuid ngo_id FK
        string verification_qr_code UK
        timestamp claimed_at
        timestamp picked_up_at
        timestamp completed_at
    }

    COMMUNITY-SHORTAGES {
        uuid shortage_id PK
        uuid org_id FK
        text description
        enum urgency
        int meals_needed
        boolean is_resolved
    }

    CHAT-LOGS {
        uuid chat_id PK
        uuid match_id FK
        uuid sender_id FK
        text message
        timestamp created_at
    }

    SYSTEM-AUDIT-LOGS {
        uuid audit_id PK
        string event_type
        uuid triggered_by FK
        text description
        timestamp created_at
    }
```

## Schema Structural Rules & Cardinality

1. **USERS to ORGANIZATIONS (`1:0..1`)**: A user can register at most one organization (NGO, Shelter, or Canteen) to bind their role permissions.
2. **USERS to DONATIONS (`1:0..N`)**: A user with the role of `donor` can declare infinite food rescue opportunities.
3. **DONATIONS to RESCUE_MATCHES (`1:0..1`)**: A specific donation is linked to at most one rescue match flow to prevent double-claiming.
4. **RESCUE_MATCHES to VOLUNTEERS (`0..N:1`)**: A volunteer user can claim multiple delivery tasks over their lifetime.
5. **SYSTEM_AUDIT_LOGS (`1:0..N`)**: The security logging engine references back to the causal user (`triggered_by`) for full auditability and trace tracking.
