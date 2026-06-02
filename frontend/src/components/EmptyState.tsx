"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

export default function EmptyState() {
  return (
    <Box
      sx={{
        textAlign: "center",
        color: "text.secondary",
        py: 6,
        px: 2,
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 56, opacity: 0.5, mb: 1 }} />
      <Typography variant="h6" color="text.secondary">
        No tasks yet.
      </Typography>
      <Typography variant="body2">Add a task above to get started.</Typography>
    </Box>
  );
}
