# plan
Вспомогательный сервис для управления задачами по проектам.

Функции UI:
- Создавать задачи и присваивать их одному из проектов.
- Смотреть подробности задачи, изменять, менять статус.
- CRUD задач и проектов

Функции в проектах:
1. При формировании коммита создавать ссылку на задачу и добавляеть ее в описание коммита.
- Если в коммите есть id задачи и задача существует, то возвращается message коммита, в котором сначала идет заголовок задачи, затем текст-что сделано из коммита, затем ссылка на задачу.
- Если в коммите вместо id задачи передано 'next', создается задача со следующим порядковым номером коммита проекта.

Ограничения:
- Один коммит может относиться к одной задаче.
- Идентификатор задачи (прим.: PLAN-0001) уникальный.

Возможные улучшения:
- При выпуске релиза проекта коммиты со ссылками на задачи прикрепляются в описание.
- При создании задачи информация о ней добавляется в репозиторий проекта.
- Хранить связи коммитов с задачей.

====
Во внешний проект нужно добавить:

1
1.0 env-файл, в котором:
1.1 Идентификатор текущего проекта в формате proj@github.
Макс - 4 знака до "@"
1.2 Адрес, где крутится бэкэнд этого проекта (/back)

.env
```console
PLAN_EXTERNAL_SERVICE_NAME="proj@github"
PLAN_URL="https://backofplan.com"
```

2
Гит-хук файл, который привязывает обработчик на питоне.
.git/hooks/commit-msg
```console
#!/bin/sh
COMMIT_MSG_FILE=$1
python .git/hooks/prepare-commit-msg.py "$COMMIT_MSG_FILE"
```
3
Обработчик на питоне.
!Прописать корректный путь до установленного питона, 
как узнать на винде (powerShell): 
Get-Command python | Select-Object -ExpandProperty Definition

.git/hooks/prepare-commit-msg.py
```python
#!C:/Users/Artyom/AppData/Local/Programs/Python/Python311 python3
import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
import sys

# Load environment variables from .env file
load_dotenv()

# Check if the commit message file path is provided as a command-line argument
if len(sys.argv) < 2:
    print("Usage: python script.py <commit_msg_file>")
    sys.exit(1)

# Read the commit message file from the arguments
commit_msg_file = sys.argv[1]

# Read the current commit message from the file
try:
    with open(commit_msg_file, 'r') as file:
        commit_msg = file.read().strip()
except FileNotFoundError:
    print(f"Error: The file {commit_msg_file} does not exist.")
    sys.exit(1)

# Default to dev environment
plan_url = os.getenv('PLAN_URL')

# Construct the JSON payload
json_payload = {
    "message": commit_msg,
    "externalServiceName": os.getenv('PLAN_EXTERNAL_SERVICE_NAME')
}

# Function to handle errors and save them to a log file
def handle_error(error_message):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open('downloads/error.log', 'a') as error_log:
        error_log.write(f"{timestamp} - {error_message}\n")
    sys.exit(1)

# Save the request payload to a log file with the timestamp
timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
with open('downloads/request.log', 'a') as request_log:
    request_log.write(f"{timestamp} - {json.dumps(json_payload)}\n")

# Make a POST request to the server and get the response
try:
    response = requests.post(
        f"{plan_url}/tasks/find-or-create",
        headers={"Content-Type": "application/json"},
        data=json.dumps(json_payload)
    )
    response.raise_for_status()  # Raises an HTTPError if the status is 4xx, 5xx

    # Check the content type of the response
    if 'text/plain' in response.headers.get('Content-Type', ''):
        # If the content type is text/plain, use the response text directly
        new_commit_msg = response.text
    else:
        # Otherwise, assume it's JSON and parse it
        response_json = response.json()
        if 'error' in response_json:
            # If there's an error, handle it
            error_message = response_json.get('message', 'No error message provided')
            handle_error(error_message)
        else:
            # If there's no error, use the message from the JSON response
            new_commit_msg = response_json.get('message', commit_msg)

    # Replace the commit message with the new one
    with open(commit_msg_file, 'w') as file:
        file.write(new_commit_msg)

except requests.exceptions.RequestException as e:
    handle_error(f"Request failed: {str(e)}")

```