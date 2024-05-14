export interface ICreateTaskApi {
  title: string
  description: string
  status: string //['To Do', 'In Progress', 'Completed']
  due_date: string
  externalServiceId: number
  externalServiceName: string
}

// {
//   "title": "Example Task",
//   "description": "This is an example task description.",
//   "status": "In Progress",
//   "due_date": "2022-12-31",
//   "externalServiceId": 1,
//   "externalServiceName": "doro@github"
// }


