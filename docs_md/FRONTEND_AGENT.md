# Frontend Agent Documentation

## 1. Role & Core Philosophy

**You are the Frontend Agent.** Your responsibility is the user experience, visual consistency, and functional integrity of the Sales Vision Web Application.

*   **Primary Goal**: Deliver a "premium, state-of-the-art" experience.
*   **Key Component**: The `ExcelGrid` is the centerpiece of the data-heavy interface, providing a unified, dense, and interactive table experience.
*   **Design Language**: Shadcn UI + Tailwind CSS. Focus on muted colors, clean typography (Inter/Geist), and responsiveness.

---

## 2. Technology Stack

*   **Framework**: Next.js 14+ (App Router).
*   **Language**: TypeScript (`.tsx`, `.ts`).
*   **Styling**: Tailwind CSS, generic `globals.css`.
*   **UI Primitives**: Shadcn UI (located in `components/ui`).
*   **Icons**: `lucide-react`.
*   **State/Fetching**: Native `fetch` wrapper (`lib/api-client`) + Domain Services.

---

## 3. Project Structure (`apps/web/src`)

### `app/` (Routing)
*   **`(auth)`**: Authentication pages (Login).
*   **`(tables)`**: The main workspace.
    *   `sales/`, `customers/`, `products/`, `targets/`: Core data pages.
    *   **Layout**: Uses `app-sidebar.tsx`, `header.tsx`, and `user-nav.tsx` for persistent navigation.

### `components/`
*   **`shared/ExcelGrid.tsx`**: **CRITICAL**. The unified data table component.
*   **`ui/`**: Reusable primitives (Button, Input, Select, DatePicker, etc.).
*   **`forms/`**: Specific form components (being phased out in favor of Grid).

### `services/`
*   **Domain-driven API calls**: `sales.ts`, `customers.ts`, `products.ts`, etc.
*   **Pattern**: Each file exports async functions that use `apiClient` to talk to the backend.

### `lib/`
*   **`api-client.ts`**: The central `fetch` wrapper.
    *   **Base URL**: `process.env.NEXT_PUBLIC_API_URL` or `/api` proxy.
    *   **🔌 Auth**: MUST send `credentials: 'include'` to pass the IAP Cookie.
    *   **Error Handling**: specifically parses FastAPI `detail` JSON responses.

---

## 4. Key Component: `ExcelGrid`

The application is standardizing on `ExcelGrid` for all major data views (`Targets`, `Customers`, `Products`, `Sales`).

**Location**: `components/shared/excel-grid.tsx`

**Features**:
*   **Zoom Controls**: Custom implementation (50% - 150%).
*   **Add Row**: Inline "I-was-right" style quick addition mode.
*   **Validation**:
    *   **Date**: Strict `yyyy-mm-dd` enforcement with visual feedback (Green/Red text).
    *   **Number**: Strict regex `^-?\d*\.?\d*$` for number inputs.
*   **Dynamic Columns**:
    *   `type: 'date'` -> `DatePicker` wrapper.
    *   `type: 'number'` -> Strict `Input`.
    *   `type: 'select'` -> `Select` dropdown.
    *   `readOnly: true` -> Greyed out text.

**Usage Pattern**:
```typescript
<ExcelGrid
    title="Sales Data"
    columns={columns}
    data={data}
    onAdd={handleAdd} // Async function calling services/sales.ts
    searchKey="client_name"
    isLoading={loading}
/>
```

---

## 5. Unified "Table Experience" Mandate

We are in the process of **"Unifying Table Experiences"**.

*   **Old Way**: Separate, inconsistent tables or raw HTML tables.
*   **New Way**: Every data page must use `ExcelGrid`.
*   **Status**: ✅ `Targets`, ✅ `Customers`, ✅ `Products`, ✅ `Sales`.
*   **Goal**: If you create a new data page, **USE EXCELGRID**.

---

## 6. Data & API Layer (Architecture Glue) 🔌

### A. API Client Wrapper
The frontend acts as a proxy for the user. It must pass credentials for IAP.

```typescript
// lib/api-client.ts
export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // <--- CRITICAL FOR IAP
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  // ... error handling
}
```

### B. Optimistic Locking Protocol (409 Handling) 🔌
When the Backend returns `409 Conflict`:
1.  **Catch Error**: In the `onAdd` or `onEdit` handler.
2.  **Notification**: Show Toast: "Data modified by another user. Refreshing..."
3.  **Action**: Trigger a data re-fetch immediately.

### C. Role-Based Visibility 🔌
*   **Manager View**: If `user.role === 'manager'`, `ExcelGrid` should show Team data.
*   **Staff View**: If `user.role === 'employee'`, `ExcelGrid` only shows Own data.
*   **Note**: The backend filters the data, but the Frontend must not show "Edit" buttons for rows the user cannot touch.

---

## 7. Development Guidelines

*   **Aesthetics First**: Use glassmorphism and subtle borders (`border-muted/40`).
*   **Strict Typing**: Maintain TypeScript interfaces matching Pydantic schemas.
*   **No Mock Data**: All `ExcelGrid` components must consume real data from `services/`.
*   **Route Groups**: Keep main app logic inside `(tables)` to inherit the dashboard layout.
