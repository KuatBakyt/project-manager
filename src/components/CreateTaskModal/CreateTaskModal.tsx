import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button, Dialog, FormGroup, HTMLSelect,
  InputGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { useCreateTaskMutation, useGetUsersQuery } from 'api/projectsApi';
import type { CreateTaskModalProps } from 'config/CreateTaskModalProps';
import type { CreateTaskRequest } from 'types/projects';

import { enUS } from 'date-fns/locale';
import { useAppSelector } from 'hooks';

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ projectId, isOpen, onClose }) => {
  const { control, handleSubmit, reset } = useForm<CreateTaskRequest>();
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const userId = useAppSelector((s) => s.user.user?.id);
  const { data: usersResponse, isLoading: isUsersLoading } = useGetUsersQuery();
  const users = usersResponse ?? [];

  const onSubmit = async (values: Omit<CreateTaskRequest, 'projectId'>) => {
    if (!userId) {
      alert('Вы не авторизованы');

      return;
    }

    await createTask({
      projectId,
      title: values.title,
      description: values.description,
      assigneeId: values.assigneeId ?? userId,
      dueDate: values.dueDate ? values.dueDate : null,
    }).unwrap();

    reset();
    onClose();
  };
  const assigneeOptions = [
    { label: 'Выберите исполнителя', value: '' },
    ...users.map((u) => ({
      label: u.username,
      value: u.id,
    })),
  ];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Новая задача">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <FormGroup label="Название задачи" labelFor="title">
          <Controller
            control={control}
            defaultValue=""
            name="title"
            render={({ field }) => <InputGroup id="title" {...field} />}
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

        <FormGroup label="Исполнитель" labelFor="assigneeId">
          <Controller
            control={control}
            defaultValue={userId}
            name="assigneeId"
            render={({ field }) => (
              <HTMLSelect
                disabled={isUsersLoading}
                id="assigneeId"
                onChange={(e) => field.onChange(e.target.value)}
                options={assigneeOptions}
                value={field.value}
              />
            )}
          />
        </FormGroup>

        <FormGroup label="Дедлайн" labelFor="dueDate">
          <Controller
            control={control}
            defaultValue={null}
            name="dueDate"
            render={({ field }) => (
              <DateInput
                formatDate={(date) => date.toLocaleDateString()}
                locale={enUS}
                onChange={(date) => field.onChange(date ?? null)}
                parseDate={(str) => new Date(str)}
                placeholder="Выберите дату"
                value={field.value}
              />
            )}
          />
        </FormGroup>

        <Button intent="success" loading={isLoading} type="submit">
          Создать
        </Button>
      </form>
    </Dialog>
  );
};

export default CreateTaskModal;
