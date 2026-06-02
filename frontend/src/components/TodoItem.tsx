"use client";

import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getCategoryColor } from "@/lib/categoryColors";
import type { Todo } from "@/lib/types";

interface TodoItemProps {
  todo: Todo;
  colorIndex: number;
  onToggle: (todo: Todo, completed: boolean) => void;
  onDelete: (todo: Todo) => void;
}

export default function TodoItem({
  todo,
  colorIndex,
  onToggle,
  onDelete,
}: TodoItemProps) {
  const badgeColor = getCategoryColor(colorIndex);

  return (
    <ListItem
      divider
      sx={{
        opacity: todo.completed ? 0.5 : 1,
        transition: "opacity 0.2s ease",
        gap: 1,
      }}
      secondaryAction={
        <Tooltip title="Delete">
          <IconButton
            edge="end"
            aria-label={`delete ${todo.text}`}
            onClick={() => onDelete(todo)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <Checkbox
        edge="start"
        checked={todo.completed}
        onChange={(e) => onToggle(todo, e.target.checked)}
        inputProps={{ "aria-label": `complete ${todo.text}` }}
      />
      <ListItemText
        primary={todo.text}
        primaryTypographyProps={{
          sx: {
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "text.secondary" : "text.primary",
            wordBreak: "break-word",
          },
        }}
      />
      <Chip
        label={todo.categoryName}
        size="small"
        sx={{
          bgcolor: badgeColor,
          color: "#fff",
          fontWeight: 600,
          mr: { xs: 4, sm: 5 },
        }}
      />
    </ListItem>
  );
}
