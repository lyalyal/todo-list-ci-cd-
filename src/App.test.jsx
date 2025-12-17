import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('Todo List App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('My Todo List')).toBeInTheDocument();
  });

  it('renders input field and add button', () => {
    render(<App />);
    expect(screen.getByTestId('todo-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
  });

  it('displays empty state message when no todos', () => {
    render(<App />);
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('adds a new todo when clicking add button', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');
    const addButton = screen.getByTestId('add-button');

    fireEvent.change(input, { target: { value: 'Buy groceries' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('adds a new todo when pressing Enter key', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');

    fireEvent.change(input, { target: { value: 'Write tests' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });

  it('clears input field after adding todo', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');

    fireEvent.change(input, { target: { value: 'Test task' } });
    fireEvent.click(screen.getByTestId('add-button'));

    expect(input).toHaveValue('');
  });

  it('does not add empty todos', () => {
    render(<App />);
    const addButton = screen.getByTestId('add-button');

    fireEvent.click(addButton);

    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('does not add todos with only whitespace', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');
    const addButton = screen.getByTestId('add-button');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(addButton);

    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('toggles todo completion status', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');

    fireEvent.change(input, { target: { value: 'Finish project' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('deletes a todo when delete button is clicked', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');

    fireEvent.change(input, { target: { value: 'Task to delete' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Task to delete')).toBeInTheDocument();

    const deleteButtons = screen.getAllByTestId(/delete-button-/);
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
  });

  it('displays correct count of active tasks', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');

    fireEvent.change(input, { target: { value: 'Task 1' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.change(input, { target: { value: 'Task 2' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.change(input, { target: { value: 'Task 3' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('3 active tasks')).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(screen.getByText('2 active tasks')).toBeInTheDocument();
  });

  it('displays singular "task" for one active task', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');

    fireEvent.change(input, { target: { value: 'Single task' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('1 active task')).toBeInTheDocument();
  });

  it('adds multiple todos correctly', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');

    fireEvent.change(input, { target: { value: 'First task' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.change(input, { target: { value: 'Second task' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.change(input, { target: { value: 'Third task' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
    expect(screen.getByText('Third task')).toBeInTheDocument();
  });

  it('maintains todos independently', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');

    fireEvent.change(input, { target: { value: 'Task A' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.change(input, { target: { value: 'Task B' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('removes empty state message when todos are added', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');

    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.queryByText(/No tasks yet/i)).not.toBeInTheDocument();
  });

  it('shows empty state message when all todos are deleted', () => {
    render(<App />);
    const input = screen.getByTestId('todo-input').querySelector('input');

    fireEvent.change(input, { target: { value: 'Temporary task' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.queryByText(/No tasks yet/i)).not.toBeInTheDocument();

    const deleteButton = screen.getByTestId(/delete-button-/);
    fireEvent.click(deleteButton);

    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });
});
