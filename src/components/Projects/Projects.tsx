import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  Icon,
  InputGroup,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from '@blueprintjs/core';
import { useGetProjectsQuery } from 'api/projectsApi';
import CreateProjectModal from 'components/CreateProjectModal/CreateProjectModal';
import type { Project } from 'types/projects';

const Projects: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetProjectsQuery({ page, limit: 6 });
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return <p>Загрузка проектов...</p>;
  }

  const projects: Project[] = data?.projects ?? [];
  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>
            <Icon icon="projects" />
            {' '}
            Лаборатория
          </NavbarHeading>
        </NavbarGroup>
        <NavbarGroup>
          <InputGroup
            leftIcon="search"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск проектов..."
            value={searchTerm}
          />
          <NavbarDivider />
          <Link to="/profile">
            <Button icon="user" intent="primary">
              Профиль
            </Button>
          </Link>
        </NavbarGroup>
      </Navbar>

      <div style={{ padding: '20px' }}>
        <h2>📂 Проекты</h2>
        <Button icon="add" intent="success" onClick={() => setIsOpen(true)}>
          Добавить проект
        </Button>

        <div className="projects-container">
          {filteredProjects.length === 0 ? (
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
              ❌ Проекты не найдены
            </p>
          ) : (
            filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="project-card"
                elevation={Elevation.TWO}
                interactive
              >
                <img
                  alt="project preview"
                  src={`https://placehold.co/250x120?text=${encodeURIComponent(project.name)}`}
                  style={{
                    width: '100%',
                    borderRadius: '4px',
                    marginBottom: '10px',
                  }}
                />
                <h4>
                  <Icon icon="folder-open" />
                  {' '}
                  {project.name}
                </h4>
                <p>{project.description}</p>
                <Link to={`/projects/${project.id}`}>
                  <Button icon="arrow-right" intent="primary">
                    Открыть
                  </Button>
                </Link>
              </Card>
            ))
          )}
        </div>

        {filteredProjects.length > 0 && (
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <ButtonGroup>
              <Button
                disabled={page === 1}
                icon="chevron-left"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
              {Array.from({ length: data?.totalPages ?? 1 }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  intent={p === page ? 'primary' : 'none'}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                disabled={page >= (data?.totalPages ?? 1)}
                icon="chevron-right"
                onClick={() => setPage((p) => Math.min((data?.totalPages ?? 1), p + 1))}
              />
            </ButtonGroup>
          </div>
        )}

        <CreateProjectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </>
  );
};

export default Projects;
