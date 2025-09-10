"use client";
import { Box, Button, Typography } from "@mui/material";

export default function CopyId({ id }) {
  if (!id) return null;
  return (
    <Box sx={{ borderRadius: 2, border: "1px solid #e0e0e0", p: 2, mb: 3, display: "inline-block" }}>
      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>ID prijave</Typography>
      <Typography sx={{ fontFamily: "monospace" }}>{id}</Typography>
      <Button size="small" sx={{ mt: 1 }} onClick={() => navigator.clipboard.writeText(id)}>
        Kopiraj ID
      </Button>
    </Box>
  );
}
