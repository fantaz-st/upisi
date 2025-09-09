"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Alert } from "@mui/material";

export default function Home() {
  const [open, setOpen] = useState(null);
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/intakes?form=diplomski");
      const j = await r.json();
      setOpen(j.data || null);
    })();
  }, []);
  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textAlign: "center" }}>
          Upisi na PFST
        </Typography>
        <Typography sx={{ opacity: 0.7, mb: 3, textAlign: "center" }}>Odaberite studij</Typography>
        {!open && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Upisi za diplomski trenutačno nisu otvoreni.
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ opacity: open ? 1 : 0.6 }}>
              <CardActionArea component={Link} href="/diplomski" disabled={!open}>
                <CardContent>
                  <Typography variant="h5">Upisi diplomski</Typography>
                  <Typography sx={{ opacity: 0.7 }}>{open ? open.title : "Zatvoreno"}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
