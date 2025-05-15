# Models Structure

This directory contains the database models for the project management system, built with Sequelize ORM.

## Directory Structure

Each model has its own directory containing:
- `*.model.interface.ts` - TypeScript interfaces for the model
- `*.model.ts` - Sequelize model implementation

## Models Overview

### User
Represents users of the system who can create projects and be assigned to tasks.

### Project
Represents projects that contain tasks and have team members.

### ProjectMember
Associates users with projects and defines their roles (owner, editor, viewer).

### Task
Represents individual tasks within projects.

### TaskAssignment
Associates tasks with the users responsible for completing them.

### TaskComment
Stores comments made by users on specific tasks.

### TaskHistory
Tracks changes made to tasks for auditing purposes.

## Usage

Models are initialized and associations are set up in the `index.ts` file. To use these models in other parts of the application, import them from this module:

```typescript
import { UserModel, TaskModel } from '../models';
```

Or import specific types:

```typescript
import { User, Task, ProjectMember } from '../models';
```

## Database Schema

The models correspond to the following database tables:
- `users`
- `projects`
- `project_members`
- `tasks`
- `task_assignments`
- `task_comments`
- `task_history`

## UUID Primary Keys

All models use UUID primary keys generated with the `uuid-generate-v4()` PostgreSQL function.
