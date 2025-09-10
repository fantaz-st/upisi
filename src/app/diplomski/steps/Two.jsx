"use client";
import { useFormContext } from "react-hook-form";
import { Grid, TextField } from "@mui/material";

export default function Two() {
  const { register } = useFormContext();
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField label="Ime oca" fullWidth {...register("ime_oca")} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField label="Zvanje i zanimanje oca" fullWidth {...register("zanimanje_oca")} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField label="Stalno boravište i točna adresa oca" fullWidth {...register("adresa_oca")} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField label="Ime majke" fullWidth {...register("ime_majke")} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField label="Zvanje i zanimanje majke" fullWidth {...register("zanimanje_majke")} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField label="Stalno boravište i točna adresa majke" fullWidth {...register("adresa_majke")} />
      </Grid>
    </Grid>
  );
}
