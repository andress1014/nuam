# Proyecto de Gestión de Tareas - Setup Inicial

Este proyecto permite la gestión de tareas y asignación de usuarios a través de una API REST. A continuación, se detallan los pasos necesarios para poblar la base de datos con datos iniciales y consumir los endpoints correctamente.

---

## 🧩 Paso 1: Insertar Datos Iniciales

Ejecuta el siguiente script SQL para insertar los datos base necesarios:

```sql
-- Tabla: users
INSERT INTO public.users (id, name, email, password_hash, created_at, updated_at, role) VALUES
('b1da810b-fe8f-46b0-83dc-a05343b599ce', 'John Doe', 'test@test.com', '$2b$10$wDyN8h6tEdqD63D3bHZcbe/DULXVXJqM3m12.p59fCzHAVdnGLF1u', '2025-05-16 05:08:27.063+00', '2025-05-16 05:08:27.063+00', 'user'),
('65bcb781-7a21-4348-859d-a453ae0af486', 'John Doe', 'admin@admin.com', '$2b$10$SE8Nj9fInq6CG5hzDkga/Oqy44ajXwpUI1Pn1qf0EVgw3uy5AyPO.', '2025-05-16 05:07:44.749+00', '2025-05-16 05:07:44.749+00', 'owner');

-- Tabla: projects
INSERT INTO public.projects (id, name, created_at, description, created_by, updated_at) VALUES
('e07033ad-f3a5-44f6-b5b9-16472a543fe7', 'asdasdsa', '2025-05-16 05:19:35.597+00', 'Project name must be between 3 and 100 characters long', '65bcb781-7a21-4348-859d-a453ae0af486', '2025-05-16 05:19:35.598+00');

-- Tabla: project_members
INSERT INTO public.project_members (id, project_id, user_id, role, added_at, created_at, updated_at) VALUES
('89d3b652-e3bf-4787-9f15-5d588579392c', 'e07033ad-f3a5-44f6-b5b9-16472a543fe7', '65bcb781-7a21-4348-859d-a453ae0af486', 'owner', '2025-05-16 05:19:35.608+00', '2025-05-16 05:19:35.609+00', '2025-05-16 05:19:35.609+00'),
('cec493aa-e3fb-4f23-ae4b-89acfe11440c', 'e07033ad-f3a5-44f6-b5b9-16472a543fe7', 'b1da810b-fe8f-46b0-83dc-a05343b599ce', 'editor', '2025-05-16 05:20:13.928+00', '2025-05-16 05:20:13.928+00', '2025-05-16 05:20:13.928+00');

-- Tabla: tasks
INSERT INTO public.tasks (id, title, description, project_id, status, created_at, due_date, updated_at) VALUES
('7e1ed1ce-bb9e-40a5-af4c-af229cbe7c55', 'Implementar feature X', 'Desarrollar la funcionalidad X siguiendo los requisitos', 'e07033ad-f3a5-44f6-b5b9-16472a543fe7', 'pending', '2025-05-16 05:20:55.217+00', '2025-05-29', '2025-05-16 05:20:55.217+00');

-- Tabla: task_assignments
INSERT INTO public.task_assignments (id, task_id, user_id, assigned_at, created_at, updated_at) VALUES
('b006a313-78e7-4a08-b95e-6be40f30447d', '7e1ed1ce-bb9e-40a5-af4c-af229cbe7c55', 'b1da810b-fe8f-46b0-83dc-a05343b599ce', '2025-05-16 05:21:58.36+00', '2025-05-16 05:21:58.36+00', '2025-05-16 05:21:58.36+00');
```

---

## 🔐 Paso 2: Login

Autentícate con el siguiente usuario usando este `curl`:

```bash
curl --location 'http://localhost:3001/api/v1/user/login' --header 'Content-Type: application/json' --data-raw '{
  "email": "admin@admin.com",
  "password": "admin123"
}'
```

---

## 🛠️ Paso 3: Crear un Proyecto

```bash
curl --location 'http://localhost:3001/api/v1/projects' --header 'Content-Type: application/json' --header 'Authorization: Bearer <TU_TOKEN>' --data '{
  "name": "asdasdsa",
  "description": "Project name must be between 3 and 100 characters long"
}'
```

---

## 👥 Paso 4: Asignar Usuario al Proyecto

El usuario debe tener rol `editor` o `viewer`.

```bash
curl --location 'http://localhost:3001/api/v1/projects/e07033ad-f3a5-44f6-b5b9-16472a543fe7/share' --header 'Content-Type: application/json' --header 'Authorization: Bearer <TU_TOKEN>' --data '{
  "userIds": ["b1da810b-fe8f-46b0-83dc-a05343b599ce"],
  "role": "editor"
}'
```

---

## 📝 Paso 5: Crear una Tarea

```bash
curl --location 'http://localhost:3001/api/v1/tasks' --header 'Content-Type: application/json' --header 'Authorization: Bearer <TU_TOKEN>' --data '{
  "projectId": "e07033ad-f3a5-44f6-b5b9-16472a543fe7",
  "title": "Implementar feature X",
  "description": "Desarrollar la funcionalidad X siguiendo los requisitos",
  "status": "pending",
  "dueDate": "2025-05-30"
}'
```

---

## 👤 Paso 6: Asignar Usuario a una Tarea

```bash
curl --location 'http://localhost:3001/api/v1/tasks/projects/e07033ad-f3a5-44f6-b5b9-16472a543fe7/assign-tasks' --header 'Content-Type: application/json' --header 'Authorization: Bearer <TU_TOKEN>' --data '{
  "assignments": [
    {
      "taskId": "7e1ed1ce-bb9e-40a5-af4c-af229cbe7c55",
      "userId": "b1da810b-fe8f-46b0-83dc-a05343b599ce"
    }
  ]
}'
```

---

## 📦 Postman Collection

Para facilitar las pruebas, se incluye un archivo Postman (`nuam.postman_collection.json`) con todos los endpoints organizados. **Importa el archivo en Postman** para empezar a hacer peticiones rápidamente.

---

## ✅ Recomendaciones

- Asegúrate de que la base de datos esté corriendo y tenga las tablas y relaciones necesarias antes de insertar los datos.
- Sustituye `<TU_TOKEN>` por el JWT real obtenido al hacer login.
- Verifica que los campos de UUID coincidan si haces pruebas con datos distintos.