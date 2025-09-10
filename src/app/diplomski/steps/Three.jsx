"use client";
import { useFormContext } from "react-hook-form";
import { Grid, TextField } from "@mui/material";

export default function Three({ onFileCheck }) {
  const { register, setValue } = useFormContext();

  function handleFile(field) {
    return (e) => {
      const f = e.target.files?.[0];
      if (!f || onFileCheck(f)) return; // ok or empty
      alert("Dozvoljeni su JPG/PNG do 16 MB.");
      setValue(field, null);
      e.target.value = "";
    };
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField type="file" inputProps={{ accept: "image/jpeg,image/png" }} onChange={handleFile("photo")} fullWidth {...register("photo")} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField type="file" inputProps={{ accept: "image/jpeg,image/png" }} onChange={handleFile("signature")} fullWidth {...register("signature")} />
      </Grid>
    </Grid>
  );
}
