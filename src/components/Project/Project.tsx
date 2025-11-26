import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { useGetProjectByIdQuery, useGetTasksQuery } from 'api/projectsApi';
import CreateTaskModal from 'components/CreateTaskModal/CreateTaskModal';
import ProjectBoard from 'components/ProjectBoard/ProjectBoard';

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading: projectLoading } = useGetProjectByIdQuery(id!);
  const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery(id!);

  const [isOpen, setIsOpen] = useState(false);

  if (projectLoading || tasksLoading) {
    return <p>Загрузка...</p>;
  }

  const tasks = Array.isArray(tasksData) ? tasksData : tasksData?.tasks ?? [];

  return (
    <div style={{ padding: '20px' }}>

      <div>
        <div>
          <h2>{project?.name}</h2>
          <p>{project?.description}</p>
        </div>
        <Button icon="add" intent="primary" onClick={() => setIsOpen(true)}>
          Добавить задачу
        </Button>
      </div>
      <ProjectBoard projectId={id!} tasks={tasks} />
      <CreateTaskModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        projectId={id!}
      />
    </div>
  );
};

export default Project;
