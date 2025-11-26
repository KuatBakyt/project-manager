import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button, Dialog, FormGroup, InputGroup,
} from '@blueprintjs/core';
import { useCreateProjectMutation } from 'api/projectsApi';
import type { CreateProjectModalProps } from 'config/CreateProjectModalProps';
import type { CreateProjectRequest } from 'types/projects';

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { control, handleSubmit, reset } = useForm<CreateProjectRequest>();
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const onSubmit = async (values: CreateProjectRequest) => {
    await createProject(values);
    reset();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Новый проект">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px',
        }}
      >
        <FormGroup label="Название проекта" labelFor="name">
          <Controller
            control={control}
            defaultValue=""
            name="name"
            render={({ field }) => <InputGroup id="name" {...field} />}
            rules={{ required: true }}
          />
        </FormGroup>

        <FormGroup label="Описание" labelFor="description">
          <Controller
            control={control}
            defaultValue=""
            name="description"
            render={({ field }) => <InputGroup id="description" {...field} />}
          />
        </FormGroup>

        <Button intent="success" loading={isLoading} type="submit">
          Создать
        </Button>
      </form>
    </Dialog>
  );
};

export default CreateProjectModal;
