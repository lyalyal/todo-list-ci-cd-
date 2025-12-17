import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false },
      ]);
      setInputValue('');
    }
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTodo();
    }
  };

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
            }}
          >
            My Todo List
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a new task..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              data-testid="todo-input"
            />
            <IconButton
              color="primary"
              onClick={handleAddTodo}
              disabled={!inputValue.trim()}
              data-testid="add-button"
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '&:disabled': { bgcolor: 'action.disabledBackground' },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {todos.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {activeTodos} active {activeTodos === 1 ? 'task' : 'tasks'}
            </Typography>
          )}

          <List data-testid="todo-list">
            {todos.map((todo) => (
              <ListItem
                key={todo.id}
                sx={{
                  bgcolor: todo.completed ? 'action.hover' : 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: 1,
                  },
                }}
              >
                <Checkbox
                  edge="start"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  data-testid={`checkbox-${todo.id}`}
                />
                <ListItemText
                  primary={todo.text}
                  sx={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'text.disabled' : 'text.primary',
                  }}
                  data-testid={`todo-text-${todo.id}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteTodo(todo.id)}
                    data-testid={`delete-button-${todo.id}`}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {todos.length === 0 && (
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ py: 4 }}
            >
              No tasks yet. Add one to get started! 🚀
            </Typography>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
