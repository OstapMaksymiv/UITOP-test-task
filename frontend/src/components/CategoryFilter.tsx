"use client";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  value: number | "all";
  onChange: (value: number | "all") => void;
}

export default function CategoryFilter({
  categories,
  value,
  onChange,
}: CategoryFilterProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const raw = event.target.value;
    onChange(raw === "all" ? "all" : Number(raw));
  };

  return (
    <FormControl
      size="small"
      sx={{ minWidth: 180, width: { xs: "100%", sm: "auto" } }}
    >
      <InputLabel id="category-filter-label">Filter by category</InputLabel>
      <Select
        labelId="category-filter-label"
        label="Filter by category"
        value={String(value)}
        onChange={handleChange}
      >
        <MenuItem value="all">All</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={String(category.id)}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
