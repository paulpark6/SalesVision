# Sales Vision Project - Claude Memory

## Communication Style
- Max concision. Drop grammar if needed.
- End plans with unresolved Q list. Ultra-concise format.
- Commit msgs: terse, no fluff.

## State Tracking Protocol
**CRITICAL**: Before ANY code changes:
1. Check relevant .md file in root (backendAPIPlan.md, frontEndLogic.md, DataPlan.md, databasedescption.md)
2. After changes: Update Current State section in that .md
3. Mark ✅/❌ status changes
4. Keep .md files as source of truth for module state

## Plan Files Reference Map & Edit Rules

make sure to update PROJECT_STATUS.md file as we go too.

### backendAPIPlan.md → `/backend` changes
**When to update**: Any change to `/backend` folder
**What to update**:
- Current State ✅/❌ checkboxes (endpoints added? DB connected? Auth working?)
- Phase completion status if full phase done
- Add new endpoints to relevant phase list
- Update dependency status (if new packages installed)

**Example**: Added `/api/v1/customers` GET endpoint
→ Update: "❌ No CRUD operations" → "✅ Customer read endpoint implemented"

---

### frontEndLogic.md → `/frontend` changes
**When to update**: Any change to `/frontend` folder
**What to update**:
- Page implementation status (if new page added/completed)
- Component library usage (if new Radix component used)
- Integration status (AI features, new API calls)
- Deployment status (if Cloud Run config changed)

**Example**: Added customer detail page with edit form
→ Update: Add to page inventory, mark edit functionality as ✅

---

### DataPlan.md → `/db/ui`, CSV/JSON pipeline
**When to update**: Changes to CSV files, JSON output, transformation scripts
**What to update**:
- CSV structure changes (new columns, format changes)
- JSON schema updates (new fields, nested objects)
- Pipeline script changes (transformation logic)
- Data validation rules added/modified

**Example**: Added `customer_lifetime_value` column to customers.csv
→ Update: CSV schema section, JSON output schema, transformation notes

---

### databasedescption.md → DB schema, migrations, models
**When to update**: SQLAlchemy models, Alembic migrations, DB structure
**What to update**:
- Table creation status (migration run? model defined?)
- Column additions/changes in models
- Relationship definitions (ForeignKey, backref)
- Migration history (new migration files)
- Index/constraint additions

**Example**: Created `customers` table with SQLAlchemy model + Alembic migration
→ Update: Mark customers table as ✅ implemented, add column list, note migration file name

## Current Architecture Reality
**Live**: Frontend on Cloud Run, static JSON, Genkit AI
**Not Built**: Backend logic, DB connections, migrations, Cloud SQL
**Docker**: Frontend image only (linux/amd64 in Artifact Registry)

## Workflow
1. User requests change
2. Identify affected .md file(s)
3. Read current state from .md
4. Make changes
5. Update .md Current State section
6. If unresolved Qs exist → list at end (concise, no grammar)

## Example Q Format
```
Unresolved Qs:
- Auth strategy? JWT vs session?
- Pagination limit default?
- CSV upload max size?
```