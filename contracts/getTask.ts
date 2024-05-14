export interface IGetTaskApi {
  "id": number
  "user_id": number
  "title": string
  "description": string
  "status": string
  "due_date": string
  "created_at": string
  "updated_at": string
  "external_task_id": string
  "service_id": number
  "service_name": string
}

// "id": 17,
// "user_id": 1,
// "title": "save filter val to local storage",
// "description": "",
// "status": "To Do",
// "due_date": "2024-05-04T21:00:00.000Z",
// "created_at": "2024-05-05T17:32:02.000Z",
// "updated_at": "2024-05-05T17:32:02.000Z",
// "external_task_id": "PLAN-0001",
// "service_id": 3,
// "service_name": "plan@github"