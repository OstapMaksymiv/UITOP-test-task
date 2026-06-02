"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { createTodo, getApiErrorMessage } from "@/lib/api";
import type { Category, Todo } from "@/lib/types";

interface AddTodoFormProps {
  categories: Category[];
  onCreated: (todo: Todo) => void;
}

interface FormValues {
  text: string;
  categoryId: string;
}

const MAX_TEXT_LENGTH = 200;

export default function AddTodoForm({
  categories,
  onCreated,
}: AddTodoFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { text: "", categoryId: "" },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const todo = await createTodo({
        text: values.text.trim(),
        categoryId: Number(values.categoryId),
      });
      onCreated(todo);
      reset({ text: "", categoryId: "" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError("categoryId", {
          type: "server",
          message: "This category already has 5 active tasks.",
        });
      } else {
        setServerError(getApiErrorMessage(error, "Failed to add task."));
      }
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="flex-start"
      >
        <Controller
          name="text"
          control={control}
          rules={{
            required: "Task text is required",
            maxLength: {
              value: MAX_TEXT_LENGTH,
              message: `Max ${MAX_TEXT_LENGTH} characters`,
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="New task"
              placeholder="What needs to be done?"
              fullWidth
              size="small"
              inputProps={{ maxLength: MAX_TEXT_LENGTH }}
              error={Boolean(errors.text)}
              helperText={errors.text?.message}
            />
          )}
        />

        <Controller
          name="categoryId"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <FormControl
              size="small"
              error={Boolean(errors.categoryId)}
              sx={{ minWidth: 160, width: { xs: "100%", sm: "auto" } }}
            >
              <InputLabel id="add-category-label">Category</InputLabel>
              <Select {...field} labelId="add-category-label" label="Category">
                {categories.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && (
                <FormHelperText>{errors.categoryId.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ minWidth: 100, width: { xs: "100%", sm: "auto" }, height: 40 }}
          startIcon={
            isSubmitting ? <CircularProgress size={18} color="inherit" /> : null
          }
        >
          {isSubmitting ? "Adding" : "Add"}
        </Button>
      </Stack>
      {serverError && (
        <FormHelperText error sx={{ mt: 1 }}>
          {serverError}
        </FormHelperText>
      )}
    </Box>
  );
}
