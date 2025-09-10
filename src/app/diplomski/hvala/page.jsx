"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Box, Button, Container, Typography } from "@mui/material";

export default function HvalaPage() {
  const search = useSearchParams();
  const router = useRouter();
  const id = search.get("id");
  const updated = search.get("updated") === "1";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "25vw minmax(0,60vw) 15vw" },
      }}
    >
      {/* Left fixed image to match form layout */}
      <Box sx={{ display: { xs: "none", md: "block" }, position: "relative" }}>
        <Box
          aria-hidden
          role="presentation"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "25vw",
            height: "100vh",
            background: `url(/assets/images/ship.jpg) center/cover no-repeat`,
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* Middle content */}
      <Container maxWidth={false} sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, md: 6 } }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
          Hvala na prijavi!
        </Typography>
        <Typography sx={{ fontSize: 18, mb: 3 }}>Vaša prijava je {updated ? "ažurirana" : "zaprimljena"}.</Typography>

        {id && (
          <Box sx={{ borderRadius: 2, border: "1px solid #e0e0e0", p: 2, mb: 3, display: "inline-block" }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>ID prijave</Typography>
            <Typography sx={{ fontFamily: "monospace" }}>{id}</Typography>
            <Button size="small" sx={{ mt: 1 }} onClick={() => navigator.clipboard.writeText(id)}>
              Kopiraj ID
            </Button>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" sx={{ background: "#5e2a84" }} onClick={() => router.push("/")}>
            Povratak na početnu
          </Button>
          <Button onClick={() => router.push("/diplomski")}>Nova prijava</Button>
        </Box>
      </Container>

      <Box />
    </Box>
  );
}
