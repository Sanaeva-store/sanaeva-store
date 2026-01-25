```mermaid
flowchart LR
  U1[Back Office Users\n(Owner/Admin/Staff)] --> BO[Back Office System]
  U2[Customers (Future Storefront)] -.-> SF[Storefront (Future)]
  SF -. API .-> BO

  BO --> PG[(Postgres)]
  BO --> S3[(Object Storage\nImages/Docs)]
  BO --> MQ[(Queue/Event Bus\nOptional)]
  BO --> EXT1[Payment Gateway\n(Future)]
  BO --> EXT2[Shipping Provider\n(Future)]
  BO --> EXT3[Email/SMS/LINE Notify\n(Optional)]

```

```mermaid
flowchart TB
  FE[Back Office Web (Next.js)] --> API[Backend API (Modular Monolith)]
  API --> PG[(Postgres)]
  API --> REDIS[(Redis optional)]
  API --> OBJ[(S3/MinIO - images/docs)]
  API --> WORKER[Background Worker\n(optional)]
  WORKER --> MQ[(Queue optional)]
  WORKER --> PG
```