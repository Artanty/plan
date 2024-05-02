# plan
Вспомогательный сервис для управления задачами по проектам.

Функции UI:
- Создавать задачи и присваивать их одному из проектов.
- Смотреть подробности задачи, переходить к коммитам.

Функции в проектах:
- При формировании коммита создается ссылка на задачу и добавляется в описание коммита.
- При отправке коммита к задаче прикрепляется ссылка на коммит.
- При выпуске релиза коммиты со ссылками на задачи прикрепляются в описание.
- При создании задачи информация о ней добавляется в репозиторий проекта.
- Если при формировании коммита задачи с таким id нет, то она создается и ссылка на нее добавляется в описание коммита.