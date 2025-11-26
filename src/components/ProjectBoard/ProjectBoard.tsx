import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Elevation } from '@blueprintjs/core';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useUpdateTaskMutation } from 'api/projectsApi';
import type { ProjectBoardProps } from 'config/ProjectBoardProps';
import type { Task } from 'types/projects';

const categories = [
  { key: 'todo', label: 'Новая', color: '#f0f8ff' },
  { key: 'in_progress', label: 'В работе', color: '#fffacd' },
  { key: 'done', label: 'Завершена', color: '#e6ffe6' },
] as const;

const ProjectBoard: React.FC<ProjectBoardProps> = ({ tasks, projectId }) => {
  const [updateTask] = useUpdateTaskMutation();

  const grouped: Record<string, Task[]> = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }
    if (destination.droppableId !== source.droppableId) {
      updateTask({ taskId: draggableId, status: destination.droppableId });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {categories.map((cat) => (
          <Droppable key={cat.key} droppableId={cat.key}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="kanban-column"
                style={{ background: cat.color }}
              >
                <h3>
                  {cat.label}
                  {' '}
                  (
                  {grouped[cat.key].length}
                  )
                </h3>
                {grouped[cat.key].map((task, index) => (
                  <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                    {(innerProvided) => (
                      <Card
                        ref={innerProvided.innerRef}
                        elevation={Elevation.TWO}
                        {...innerProvided.draggableProps}
                        {...innerProvided.dragHandleProps}
                        style={{
                          marginBottom: '10px',
                          ...innerProvided.draggableProps.style,
                        }}
                      >
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <p>
                          Статус:
                          {' '}
                          {cat.label}
                        </p>
                        <div className="task-actions">
                          <Button
                            intent="warning"
                            onClick={() => updateTask({ taskId: task.id, status: 'in_progress' })}
                          >
                            В работу
                          </Button>
                          <Button
                            intent="success"
                            onClick={() => updateTask({ taskId: task.id, status: 'done' })}
                          >
                            Завершить
                          </Button>
                          <Link to={`/projects/${projectId}/task/${task.id}`}>
                            <Button icon="arrow-right" intent="primary">
                              Подробнее
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default ProjectBoard;
