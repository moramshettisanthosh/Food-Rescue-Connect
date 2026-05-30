# Testing Documentation

This document outlines the validation suite for **Food Rescue Connect (RescueConnect)**, detailing unit test fixtures, end-to-end (E2E) automation scenarios, and manual review matrices.

---

## 1. Unit Testing Suite (Jest & React Testing Library)

We validate individual React components and state utility hooks using Jest and testing-library runners.

### Test Target: `DonorModule.tsx` (AI Image Quality Scans)
*   **Objective:** Verify that the image processing preset selector updates the telemetry states and locks unsafe food submissions cleanly.

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DonorModule } from '../components/DonorModule';

describe('DonorModule AI Image Quality Scans', () => {
  test('should display scanning overlay upon selecting preset', async () => {
    const mockSuccess = jest.fn();
    render(<DonorModule onDonationSuccess={mockSuccess} language="en" />);

    // Select the Canteen Biryani Preset
    const presetBtn = screen.getByText(/Bulk Vegetable Biryani/i);
    fireEvent.click(presetBtn);

    // Scanner should switch to "Scanning..."
    expect(screen.getByText(/AI Estimating Category & Safety/i)).toBeInTheDocument();

    // Wait for simulated scan completion (2000ms mock)
    await waitFor(() => {
      expect(screen.getByText(/APPROVED \/ SAFE/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify Match Button is unlocked
    const matchBtn = screen.getByText(/Securely Publish & Match NGO/i);
    expect(matchBtn).not.toBeDisabled();
  });

  test('should block matching submission for unsafe food items', async () => {
    const mockSuccess = jest.fn();
    render(<DonorModule onDonationSuccess={mockSuccess} language="en" />);

    // Select Unsafe Milk Pouches
    const unsafeBtn = screen.getByText(/Dairy Fresh Milk Pouches/i);
    fireEvent.click(unsafeBtn);

    await waitFor(() => {
      expect(screen.getByText(/REJECTED \/ HAZARD/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Matching button should say blocked and be disabled
    const blockedBtn = screen.getByText(/Blocked: Unsafe Food Quality/i);
    expect(blockedBtn).toBeDisabled();
  });
});
```

---

## 2. End-to-End Automation Testing (Cypress / Playwright)

E2E testing replicates standard user role journeys across the dashboard views.

### Cypress Spec: `volunteer_delivery_journey.cy.ts`
*   **Objective:** Automate the role switching from Donor to Volunteer, claim a pickup job, and complete verification via QR scanner simulator.

```typescript
describe('Volunteer Rescue Delivery Lifecycle', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('completes donor upload and volunteer routing claims successfully', () => {
    // 1. Switch to Donor
    cy.get('.role-selector').contains('DONOR').click();
    cy.get('.role-btn.active').should('contain', 'DONOR');

    // 2. Select first preset and scan
    cy.get('button').contains('Bulk Vegetable').click();
    cy.wait(2500); // Wait for scanning to resolve

    // 3. Match
    cy.get('button').contains('Securely Publish').click();
    cy.get('.user-profile-preview').should('contain', 'Matching Established!');

    // 4. Switch to Volunteer console
    cy.get('.role-selector').contains('VOLUNTEER').click();
    cy.get('.nav-item').contains('Volunteer Hub').click();

    // 5. Claim Pickup Job
    cy.get('.btn').contains('Accept Rescue Task').first().click();
    cy.get('.btn').contains('Verify with QR').should('be.visible');

    // 6. Trigger QR Verification
    cy.get('.btn').contains('Verify with QR').click();
    cy.get('.btn').contains('Verify & Submit').click();

    // 7. Check Gamification Point Boost
    cy.get('.badge').should('contain', 'Delivered ✓');
    cy.get('.profile-role').should('contain', 'pts'); // Points updated in profile footer
  });
});
```

---

## 3. Manual Vetting Matrix

For manual testing evaluations (hackathons / academic presentation runs), follow the matrix below:

| Step | Action Input | Expected UI Behavior | Verification Status |
|---|---|---|---|
| **1** | Toggle Language Button to "हिन्दी" | Global titles, dashboards and donor panels convert instantly to Hindi. | Pass |
| **2** | Toggle High Contrast Accessibility mode | Background turns rich `#000000` pitch black, and borders turn solid white `#ffffff` with high readability. | Pass |
| **3** | Click on Map coordinate nodes | Opens node telemetries card showing active coordination addresses, distances, and portion weights. | Pass |
| **4** | Click "Monthly Recognition Certificate" | Generates virtual Gold-sealed PNG template dynamically on Canvas. | Pass |
| **5** | Click "Download High-Res PNG" in Certificate | Browser triggers instant document download to local user downloads folder. | Pass |
| **6** | Trigger Perishable Emergency Escalation (NGO Portal) | Starts 3-tiered ring cascade timer showing instant notifications to student and regional responders. | Pass |
