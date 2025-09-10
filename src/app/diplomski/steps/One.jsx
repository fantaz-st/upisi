"use client";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { useFormContext, Controller } from "react-hook-form";
import { Box, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

const DatePicker = dynamic(() => import("@mui/x-date-pickers/DatePicker").then((m) => m.DatePicker), { ssr: false });

export default function One({ programs }) {
  const { register, control } = useFormContext();

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Odaberite studij koji upisujete
      </Typography>
      <Controller
        name="program"
        control={control}
        render={({ field }) => (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4,1fr)" }, gap: 1, mb: 2 }}>
            {programs.map((p) => (
              <ToggleButton key={p} value={p} selected={field.value === p} onChange={() => field.onChange(p)} sx={{ textTransform: "none", borderRadius: 2 }}>
                {p}
              </ToggleButton>
            ))}
          </Box>
        )}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Odaberite status
      </Typography>
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <ToggleButtonGroup exclusive value={field.value} onChange={(_, v) => v && field.onChange(v)} sx={{ gap: 1, mb: 2 }}>
            <ToggleButton value="redoviti" sx={{ textTransform: "none", borderRadius: 2 }}>
              Redoviti student
            </ToggleButton>
            <ToggleButton value="izvanredni" sx={{ textTransform: "none", borderRadius: 2 }}>
              Izvanredni student
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Odaberite spol
      </Typography>
      <Controller
        name="spol"
        control={control}
        render={({ field }) => (
          <ToggleButtonGroup exclusive value={field.value} onChange={(_, v) => v && field.onChange(v)} sx={{ gap: 1, mb: 2 }}>
            <ToggleButton value="ženski" sx={{ textTransform: "none", borderRadius: 2 }}>
              Ženski
            </ToggleButton>
            <ToggleButton value="muški" sx={{ textTransform: "none", borderRadius: 2 }}>
              Muški
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Ime" fullWidth required {...register("ime", { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Prezime" fullWidth required {...register("prezime", { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="datum_rodjenja"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <DatePicker label="Dan, mjesec i godina rođenja" value={field.value ? dayjs(field.value) : null} onChange={(v) => field.onChange(v ? v.format("YYYY-MM-DD") : "")} format="DD.MM.YYYY" disableFuture slotProps={{ textField: { fullWidth: true, required: true } }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="OIB"
            fullWidth
            required
            {...register("oib", { required: true })}
            inputProps={{ inputMode: "numeric", pattern: "\\d{11}", maxLength: 11 }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Mjesto rođenja" fullWidth required {...register("mjesto_rodjenja", { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Država rođenja" fullWidth required {...register("drzava_rodjenja", { required: true })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField label="Točna adresa stalnog boravka izvan mjesta školovanja (država, općina, mjesto, ulica i kućni broj)" fullWidth required {...register("adresa", { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Bračno stanje" fullWidth {...register("bracno_stanje")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Državljanstvo" fullWidth required {...register("drzavljanstvo", { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField type="email" label="E-mail adresa" fullWidth required {...register("email", { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Mobitel (bez razmaka i bez +385)"
            fullWidth
            required
            {...register("mobitel", { required: true })}
            inputProps={{ inputMode: "numeric", pattern: "\\d{8,12}", maxLength: 12 }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 12);
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField label="Završen preddiplomski studij temeljem kojeg se upisuje" fullWidth {...register("zavrsen_preddiplomski")} />
        </Grid>
      </Grid>
    </>
  );
}
