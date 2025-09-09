"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Box, Container, Typography, ToggleButton, ToggleButtonGroup, Grid, TextField, Button, Checkbox, FormControlLabel, Alert, LinearProgress } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
const DatePicker = dynamic(() => import("@mui/x-date-pickers/DatePicker").then((m) => m.DatePicker), { ssr: false });

const programs = ["Brodostrojarstva", "Pomorskog menadžmenta", "Pomorske nautike", "Pomorskih elektrotehničkih i informatičkih tehnologija"];

export default function Diplomski() {
  const [intake, setIntake] = useState(null);
  const [program, setProgram] = useState(programs[0]);
  const [status, setStatus] = useState("redoviti");
  const [spol, setSpol] = useState("ženski");
  const [dob, setDob] = useState(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/intakes?form=diplomski", { cache: "no-store" });
      const j = await r.json();
      setIntake(j.data || null);
    })();
  }, []);

  const MAX = 16 * 1024 * 1024;
  function checkFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const okType = ["image/jpeg", "image/png"].includes(f.type);
    if (!okType || f.size > MAX) {
      alert("Only JPG/PNG up to 16 MB are allowed.");
      e.target.value = "";
    }
  }

  async function submit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (!intake?.id) return;
    setLoading(true);
    setOk(null);
    const fd = new FormData(formEl);
    fd.set("intake_id", intake.id);
    fd.set("form", "diplomski");
    fd.set("program", program);
    fd.set("status", status);
    fd.set("spol", spol);
    fd.set("privola", consent ? "true" : "false");
    fd.set("datum_rodjenja", dob ? dob.format("YYYY-MM-DD") : "");
    const res = await fetch("/api/submit", { method: "POST", body: fd });
    const j = await res.json();
    setLoading(false);
    setOk(res.ok ? j : { error: j.error || "Error" });
    if (res.ok) {
      formEl.reset();
      setConsent(false);
      setProgram(programs[0]);
      setStatus("redoviti");
      setSpol("ženski");
      setDob(null);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(280px,33vw) 1fr" } }}>
      <Box
        aria-hidden
        role="presentation"
        sx={{
          background: `url(/assets/images/ship.jpg) center/cover no-repeat`,
          position: { md: "sticky" },
          top: 0,
          minHeight: { xs: 240, md: "100vh" },
        }}
      />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            Master’s admissions
          </Typography>
          <Typography sx={{ mb: 3 }}>You’ll need a photo and signature (JPG/PNG, up to 16 MB). Please fill in all required fields.</Typography>

          {loading && <LinearProgress sx={{ mb: 2 }} />}
          {ok?.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {ok.error}
            </Alert>
          )}
          {ok?.id && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {ok.replaced ? `Updated. ID: ${ok.id}` : `Received. ID: ${ok.id}`}{" "}
              <Button size="small" onClick={() => navigator.clipboard.writeText(ok.id)}>
                Copy ID
              </Button>
            </Alert>
          )}
          {!intake && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Admissions are currently closed.
            </Alert>
          )}

          <form onSubmit={submit} encType="multipart/form-data" noValidate>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
              Programme
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4,1fr)" }, gap: 1, mb: 2 }}>
              {programs.map((p) => (
                <ToggleButton key={p} value={p} selected={program === p} onChange={() => setProgram(p)} sx={{ textTransform: "none", borderRadius: 2 }}>
                  {p}
                </ToggleButton>
              ))}
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Study status
            </Typography>
            <ToggleButtonGroup exclusive value={status} onChange={(_, v) => v && setStatus(v)} sx={{ gap: 1, mb: 2 }}>
              <ToggleButton value="redoviti" sx={{ textTransform: "none", borderRadius: 2 }}>
                Full-time
              </ToggleButton>
              <ToggleButton value="izvanredni" sx={{ textTransform: "none", borderRadius: 2 }}>
                Part-time
              </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Gender
            </Typography>
            <ToggleButtonGroup exclusive value={spol} onChange={(_, v) => v && setSpol(v)} sx={{ gap: 1, mb: 2 }}>
              <ToggleButton value="ženski" sx={{ textTransform: "none", borderRadius: 2 }}>
                Female
              </ToggleButton>
              <ToggleButton value="muški" sx={{ textTransform: "none", borderRadius: 2 }}>
                Male
              </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Personal information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="ime" label="First name" autoComplete="given-name" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="prezime" label="Last name" autoComplete="family-name" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DatePicker label="Date of birth" value={dob} onChange={setDob} format="DD.MM.YYYY" disableFuture slotProps={{ textField: { fullWidth: true, required: true } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  name="oib"
                  label="OIB"
                  fullWidth
                  required
                  inputProps={{ inputMode: "numeric", pattern: "\\d{11}", maxLength: 11 }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="mjesto_rodjenja" label="Place of birth" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="drzava_rodjenja" label="Country of birth" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField name="adresa" label="Full permanent address" autoComplete="street-address" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="bracno_stanje" label="Marital status" fullWidth />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="drzavljanstvo" label="Citizenship" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField type="email" name="email" label="E-mail" autoComplete="email" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  name="mobitel"
                  label="Mobile (no spaces, no +385)"
                  autoComplete="tel"
                  fullWidth
                  required
                  inputProps={{ inputMode: "numeric", pattern: "\\d{8,12}", maxLength: 12 }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 12);
                  }}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
              Previous education
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField name="zavrsen_preddiplomski" label="Finished bachelor’s programme (basis for enrolment)" fullWidth />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
              Uploads
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField type="file" name="photo" inputProps={{ accept: "image/jpeg,image/png" }} onChange={checkFile} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField type="file" name="signature" inputProps={{ accept: "image/jpeg,image/png" }} onChange={checkFile} fullWidth />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
              Consent
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <input type="text" name="fax" tabIndex="-1" autoComplete="off" style={{ position: "absolute", left: "-9999px" }} />
                <FormControlLabel control={<Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} />} label="I confirm the data is correct and I consent to personal data processing." />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button href="/">Back</Button>
              <Button type="submit" disabled={!consent || !intake || loading} variant="contained" sx={{ background: "#5e2a84" }}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </form>
        </LocalizationProvider>
      </Container>
    </Box>
  );
}
