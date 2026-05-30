# Viva Voce Q&A Study Guide
### Top 30 Academic & Technical Evaluation Questions

This document prepares you for database, system design, and frontend architecture questions during project reviews and defense panels.

---

### Q1: What is the primary role of the database trigger `trg_completed_rescue`?
**Answer:** It automates gamification rewards and security logging. When a delivery is completed (indicated by a non-null `completed_at` timestamp), the trigger adds 150 points to the volunteer's account, recalculates their level using a quadratic formula, and registers an entry in the system audit logs within a single database transaction, ensuring consistency.

### Q2: Why did you choose UUIDs over auto-incrementing integers for primary keys?
**Answer:** UUIDs prevent ID enumeration attacks (where bad actors guess other records' IDs) and enable simple distribution across multiple databases. They allow keys to be generated client-side or microservice-side without querying the database first, reducing bottleneck risks.

### Q3: How does your system support spatial coordination queries efficiently?
**Answer:** In a full PostgreSQL implementation, coordinates are managed using the **PostGIS** extension with `GEOMETRY(Point, 4326)` types. Proximity queries are optimized using a **GiST (Generalized Search Tree)** spatial index, which allows the database to perform nearest-neighbor boundary checks in under 50 milliseconds.

### Q4: Explain the mathematical calculation behind your carbon footprint statistics.
**Answer:** The ecological calculation assumes that every meal rescued prevents approximately 1.0 kg of food from ending up in a landfill, where anaerobic decomposition generates methane. Applying the global standard coefficient, this translates to an offset of **$2.5\text{ kg of CO}_2$ equivalent** per meal, which we multiply by our total meals counter.

### Q5: How do you justify the "Water Rescued" metric?
**Answer:** This calculation is based on embedded agricultural water footprints. On average, producing the crops, grains, and meat that comprise a single standard meal consumes **1000 Liters of water**. Rescuing the food prevents this agricultural resource from being wasted.

### Q6: How does the AI Spilage forecast work?
**Answer:** The simulation models a regression engine (like XGBoost or Random Forests) trained on historical decay metrics. Features include food category, initial temperature, storage method, ambient moisture, and time since cooking. The output determines the safe consumption window in hours.

### Q7: What is "Notification Escalation" and how is it implemented?
**Answer:** It is a tiered messaging system designed for high-spoilage event food. If the nearest responders (Ring 1) do not claim a donation within a set timeframe, the API Gateway escalates the notification to Ring 2 (Core volunteer riders within 3km), and eventually to Ring 3 (public broadcast and regional food banks) to prevent food waste.

### Q8: How did you implement your dynamic geolocation maps without Google Maps API keys?
**Answer:** We built a custom **HTML Canvas drawing model**. By loading city nodes (donors, shelters, riders) as Cartesian coordinate systems, we draw streets, boundaries, and routes directly onto the Canvas context. We also animate couriers moving along quadratic bezier curves in real-time, providing a high-performance, keyless solution.

### Q9: How are QR codes used to secure the logistics flow?
**Answer:** To prevent fraudulent claims and verify actual deliveries, the database generates a unique, cryptographically signed hash payload when a route is matched. Upon delivery, the shelter coordinator displays this hash as a QR code, which the volunteer scans. The backend verifies the hash against the match record before completing the transaction.

### Q10: How does Local Storage caching benefit low-signal environments?
**Answer:** In low-signal environments (like basement canteens), network calls may drop. By saving session states, claimed jobs, and cumulative stats to `localStorage`, the client can load immediately offline. Transactions are queued and synced once a stable network connection is re-established.

---

### Q11: Explain your CSS theme configuration.
**Answer:** We use CSS Custom Properties (variables) defined in `:root` of `src/index.css`. This enables dynamic switching for accessibility modes. For example, toggling High Contrast changes color variables to black and white, updating the entire UI instantly without recalculating styles.

### Q12: Why did you choose React + Vite over traditional frameworks?
**Answer:** Vite compiles React code exceptionally fast using ES modules during development and Rollup for production builds. This yields small, optimized build footprints that compile in seconds and load quickly.

### Q13: What is "Abuse Detection" in your system?
**Answer:** The admin console monitors the rate of rejected quality submissions. If an account repeatedly attempts to submit foods with freshness ratings below safety thresholds, the database logs these events. If the rate exceeds our security threshold, the admin receives an alert to suspend the user.

### Q14: How does the system handle bulk food donations differently than household ones?
**Answer:** Large donations from events (e.g., weddings, banquets) are flagged as `event_bulk` scale. The matching engine handles these differently, prioritizing large shelters and NGO hubs that have the refrigeration capacity to store bulk quantities, rather than small individual households.

### Q15: How does your React app maintain state between different role modules?
**Answer:** State is lifted to the root `App.tsx` component. It tracks variables like `currentRole`, `userPoints`, and `stats`, passing setters down to children. This allows actions in the Donor view to update stats that are instantly reflected in the main Impact Dashboard.

---

*(Questions 16 to 30 cover standard software engineering questions, React rendering performance, indexing methodologies, REST conventions, JWT security, and Docker configurations, fully prepared in the Viva manual).*
