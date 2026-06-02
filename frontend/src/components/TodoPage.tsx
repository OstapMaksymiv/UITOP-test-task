"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddTodoForm from "./AddTodoForm";
import CategoryFilter from "./CategoryFilter";
import TodoList from "./TodoList";
import { SNACKBAR_DURATION_MS, useSnackbar } from "@/context/SnackbarProvider";
import {
  createTodo,
  deleteTodo,
  fetchCategories,
  fetchTodos,
  getApiErrorMessage,
  updateTodoCompleted,
} from "@/lib/api";
import type { Category, Todo } from "@/lib/types";

export default function TodoPage() {
  const { showSnackbar, closeSnackbar } = useSnackbar();

  const [categories, setCategories] = useState<Category[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const clearTimer = useCallback((id: number) => {
    const handle = timers.current.get(id);
    if (handle) {
      clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [cats, list] = await Promise.all([
          fetchCategories(),
          fetchTodos(),
        ]);
        if (!cancelled) {
          setCategories(cats);
          setTodos(list);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getApiErrorMessage(
              err,
              "Could not load data. Is the backend running?",
            ),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isFirstFilterRun = useRef(true);
  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchTodos(
          selectedCategory === "all" ? undefined : selectedCategory,
        );
        if (!cancelled) setTodos(list);
      } catch (err) {
        if (!cancelled) {
          showSnackbar({
            message: getApiErrorMessage(err, "Failed to filter tasks."),
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, showSnackbar]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((handle) => clearTimeout(handle));
      map.clear();
    };
  }, []);

  const setCompletedLocally = useCallback((id: number, completed: boolean) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t)),
    );
  }, []);

  const removeLocally = useCallback((id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleToggle = useCallback(
    async (todo: Todo, completed: boolean) => {
      if (!completed) {
        clearTimer(todo.id);
        setCompletedLocally(todo.id, false);
        closeSnackbar();
        try {
          await updateTodoCompleted(todo.id, false);
        } catch (err) {
          showSnackbar({
            message: getApiErrorMessage(err, "Failed to update task."),
          });
        }
        return;
      }

      setCompletedLocally(todo.id, true);

      try {
        await updateTodoCompleted(todo.id, true);
      } catch (err) {
        setCompletedLocally(todo.id, false);
        showSnackbar({
          message: getApiErrorMessage(err, "Failed to complete task."),
        });
        return;
      }

      const handle = setTimeout(async () => {
        timers.current.delete(todo.id);
        try {
          await deleteTodo(todo.id);
        } catch {}
        removeLocally(todo.id);
        closeSnackbar();
      }, SNACKBAR_DURATION_MS);
      timers.current.set(todo.id, handle);
      showSnackbar({
        message: "Task completed",
        onUndo: async () => {
          clearTimer(todo.id);
          setCompletedLocally(todo.id, false);
          try {
            await updateTodoCompleted(todo.id, false);
          } catch (err) {
            showSnackbar({
              message: getApiErrorMessage(err, "Failed to undo."),
            });
          }
        },
      });
    },
    [
      clearTimer,
      closeSnackbar,
      removeLocally,
      setCompletedLocally,
      showSnackbar,
    ],
  );

  const handleDelete = useCallback(
    async (todo: Todo) => {
      clearTimer(todo.id);

      removeLocally(todo.id);
      try {
        await deleteTodo(todo.id);
      } catch (err) {
        setTodos((prev) => [todo, ...prev]);
        showSnackbar({
          message: getApiErrorMessage(err, "Failed to delete task."),
        });
        return;
      }

      showSnackbar({
        message: "Task deleted",
        onUndo: async () => {
          try {
            const recreated = await createTodo({
              text: todo.text,
              categoryId: todo.categoryId,
            });
            setTodos((prev) => [recreated, ...prev]);
          } catch (err) {
            showSnackbar({
              message: getApiErrorMessage(err, "Could not restore task."),
            });
          }
        },
      });
    },
    [clearTimer, removeLocally, showSnackbar],
  );

  const handleCreated = useCallback(
    (todo: Todo) => {
      if (selectedCategory === "all" || selectedCategory === todo.categoryId) {
        setTodos((prev) => [todo, ...prev]);
      }
      showSnackbar({ message: "Task added" });
    },
    [selectedCategory, showSnackbar],
  );

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 5 } }}>
      <Typography variant="h1" gutterBottom>
        Task Manager
      </Typography>

      <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Add a task
        </Typography>
        <AddTodoForm categories={categories} onCreated={handleCreated} />
      </Paper>

      <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h2">Tasks</Typography>
          <CategoryFilter
            categories={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        </Stack>

        <Divider sx={{ mb: 1 }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : (
          <TodoList
            todos={todos}
            categories={categories}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </Paper>
    </Container>
  );
}
