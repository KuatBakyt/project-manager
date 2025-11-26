import { Button, Card } from '@blueprintjs/core';
import { useDeleteProjectMutation } from 'api/projectsApi';
import type { Project } from 'store/projectSlice/types';

// import CreateTaskForm from 'features/tasks/CreateTaskForm';
// import TaskList from 'features/tasks/TaskList';

type Props = {
  project: Project
  // children?: ReactNode
};

const ProjectCard = ({ project }: Props) => {
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();

  const handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Удалить проект "${project.title}"?`)) {
      return;
    }
    deleteProject(project.id);
  };

  return (
    <Card interactive>
      <h3>{project.title}</h3>
      {project.description && <p>{project.description}</p>}

      {/* {children} */}
      {/* <CreateTaskForm projectId={project.id} /> */}
      <Button
        intent="danger"
        loading={isLoading}
        onClick={handleDelete}
        style={{ marginTop: 10 }}
        text="Удалить"
      />
    </Card>
  );
};

export default ProjectCard;
