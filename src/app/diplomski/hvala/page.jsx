import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import CopyId from "./CopyId";

export default function HvalaPage({ searchParams }) {
  const id = searchParams?.id ?? null;
  const updated = searchParams?.updated === "1";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "25vw minmax(0,60vw) 15vw" },
      }}
    >
      {/* Left fixed image */}
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

        <CopyId id={id} />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button component={Link} href="/" variant="contained" sx={{ background: "#5e2a84" }}>
            Povratak na početnu
          </Button>
          <Button component={Link} href="/diplomski">
            Nova prijava
          </Button>
        </Box>
      </Container>

      {/* Right spacer */}
      <Box />
    </Box>
  );
}
