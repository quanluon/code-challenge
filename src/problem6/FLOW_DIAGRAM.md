# Scoreboard API Module - Execution Flow Diagrams

## 1. Score Update Flow

```mermaid
flowchart TD
    A[Client: User completes action] --> B[POST /api/scores/update]
    B --> C{Authenticated?}
    C -->|No| D[Return 401 Unauthorized]
    C -->|Yes| E[Extract userId from token]
    E --> F{userId matches request?}
    F -->|No| G[Return 403 Forbidden]
    F -->|Yes| H[Validate request body]
    H --> I{Valid input?}
    I -->|No| J[Return 400 Bad Request]
    I -->|Yes| K[Check rate limit]
    K --> L{Rate limit OK?}
    L -->|No| M[Return 429 Too Many Requests]
    L -->|Yes| N[Check actionId in DB]
    N --> O{actionId exists?}
    O -->|Yes| P[Return 409 Conflict - Duplicate]
    O -->|No| Q[Begin DB Transaction]
    Q --> R[Get current user score]
    R --> S[Calculate new score]
    S --> T[Validate score increment bounds]
    T --> U{Valid increment?}
    U -->|No| V[Rollback & Return 400]
    U -->|Yes| W[Update score in DB]
    W --> X[Insert action log]
    X --> Y[Commit transaction]
    Y --> Z[Invalidate cache]
    Z --> AA[Recalculate top 10]
    AA --> AB[Update cache]
    AB --> AC[Broadcast to WebSocket clients]
    AC --> AD[Return 200 OK with new score & rank]
```

## 2. Leaderboard Query Flow

```mermaid
flowchart TD
    A[Client: GET /api/scores/leaderboard] --> B{Check cache}
    B -->|Cache hit| C[Return cached leaderboard]
    B -->|Cache miss| D[Query database]
    D --> E[SELECT top 10 ORDER BY score DESC]
    E --> F[Format response]
    F --> G[Update cache]
    G --> H[Return leaderboard JSON]
```

## 3. Real-time Update Broadcast Flow

```mermaid
flowchart TD
    A[Score Update Completed] --> B[New leaderboard calculated]
    B --> C[Get all active WebSocket connections]
    C --> D[For each connection]
    D --> E{Connection valid?}
    E -->|No| F[Remove from pool]
    E -->|Yes| G[Prepare update message]
    G --> H[Send leaderboard_update event]
    H --> I{More connections?}
    I -->|Yes| D
    I -->|No| J[Complete broadcast]
```

## 4. WebSocket Connection Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Auth
    participant WSManager
    participant Broadcast

    Client->>API: WebSocket Handshake<br/>(with JWT token)
    API->>Auth: Validate token
    Auth-->>API: Token valid
    API->>WSManager: Register connection
    WSManager-->>Client: Connection established (101)
    
    API->>WSManager: Send initial leaderboard
    WSManager->>Client: leaderboard_update (full state)
    
    loop Heartbeat
        WSManager->>Client: ping
        Client->>WSManager: pong
    end
    
    Note over API,Broadcast: Score update occurs
    Broadcast->>WSManager: Notify all connections
    WSManager->>Client: leaderboard_update (delta)
    
    Client->>WSManager: Close connection
    WSManager->>WSManager: Remove from pool
```

## 5. Security Validation Flow

```mermaid
flowchart TD
    A[Incoming Request] --> B[Extract JWT token]
    B --> C{Token present?}
    C -->|No| D[Return 401]
    C -->|Yes| E[Verify token signature]
    E --> F{Signature valid?}
    F -->|No| D
    F -->|Yes| G[Check token expiration]
    G --> H{Not expired?}
    H -->|No| D
    H -->|Yes| I[Extract userId from token]
    I --> J[Compare with request userId]
    J --> K{Match?}
    K -->|No| L[Return 403]
    K -->|Yes| M[Validate actionId format]
    M --> N{Valid format?}
    N -->|No| O[Return 400]
    N -->|Yes| P[Check duplicate actionId]
    P --> Q{Already exists?}
    Q -->|Yes| R[Return 409]
    Q -->|No| S[Validate score increment]
    S --> T{Within bounds?}
    T -->|No| O
    T -->|Yes| U[Check rate limit]
    U --> V{Under limit?}
    V -->|No| W[Return 429]
    V -->|Yes| X[Proceed with update]
```

## 6. System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Browser]
        Mobile[Mobile App]
    end
    
    subgraph "API Gateway / Load Balancer"
        LB[Load Balancer]
    end
    
    subgraph "Application Server Cluster"
        API1[API Instance 1]
        API2[API Instance 2]
        API3[API Instance N]
    end
    
    subgraph "Shared Services"
        Redis[(Redis Cache<br/>Rate Limiting<br/>Pub/Sub)]
        Auth[Auth Service<br/>JWT Validation]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Scores & Logs)]
        Replica[(Read Replica)]
    end
    
    Web --> LB
    Mobile --> LB
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> Redis
    API2 --> Redis
    API3 --> Redis
    
    API1 --> Auth
    API2 --> Auth
    API3 --> Auth
    
    API1 --> DB
    API2 --> DB
    API3 --> DB
    
    API1 --> Replica
    API2 --> Replica
    API3 --> Replica
    
    Redis -.->|Pub/Sub| API1
    Redis -.->|Pub/Sub| API2
    Redis -.->|Pub/Sub| API3
```

## 7. Error Handling Flow

```mermaid
flowchart TD
    A[Request Received] --> B[Try: Process Request]
    B --> C{Error occurred?}
    C -->|No| D[Return Success Response]
    C -->|Yes| E[Log Error with Context]
    E --> F{Error Type?}
    
    F -->|Validation Error| G[Return 400 Bad Request]
    F -->|Auth Error| H[Return 401/403]
    F -->|Duplicate Action| I[Return 409 Conflict]
    F -->|Rate Limit| J[Return 429 with Retry-After]
    F -->|Database Error| K[Return 500 Internal Error]
    F -->|Unknown| K
    
    G --> L[Include error details]
    H --> L
    I --> L
    J --> L
    K --> M[Include requestId for tracing]
    M --> L
    L --> N[Send Response]
```

## 8. Cache Invalidation Strategy

```mermaid
flowchart LR
    A[Score Update] --> B[Invalidate User Cache]
    B --> C[Invalidate Leaderboard Cache]
    C --> D[Query Fresh Data]
    D --> E[Update Cache]
    E --> F[Broadcast Update]
    
    G[Leaderboard Query] --> H{Cache Valid?}
    H -->|Yes| I[Return Cached Data]
    H -->|No| D
```

---

**Note**: These diagrams use Mermaid syntax and can be rendered in:
- GitHub/GitLab markdown viewers
- VS Code with Mermaid extension
- Online Mermaid editors (mermaid.live)
- Documentation tools that support Mermaid

