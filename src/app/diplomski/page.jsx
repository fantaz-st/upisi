"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Alert, LinearProgress, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm, FormProvider } from "react-hook-form";

import { steps, programs, izborniPrvi, izborniDrugi, MAX_FILE_BYTES } from "./constants";
import One from "./steps/One";
import Two from "./steps/Two";
import Three from "./steps/Three";
import Four from "./steps/Four";
import Five from "./steps/Five";
import StepperVertical from "./StepperVertical/StepperVertical";

import { useRouter } from "next/navigation";

const defaultValues = {
  program: programs[0],
  status: "redoviti",
  spol: "ženski",
  datum_rodjenja: "",

  ime: "",
  prezime: "",
  oib: "",
  mjesto_rodjenja: "",
  drzava_rodjenja: "",
  adresa: "",
  bracno_stanje: "",
  drzavljanstvo: "",
  email: "",
  mobitel: "",
  zavrsen_preddiplomski: "",

  ime_oca: "",
  zanimanje_oca: "",
  adresa_oca: "",
  ime_majke: "",
  zanimanje_majke: "",
  adresa_majke: "",

  izborni: [], // array of elective IDs
  privola: false, // consent
  photo: null, // FileList (RHF stores FileList)
  signature: null,
};

export default function Diplomski() {
  const [letsGo, setLetsGo] = useState(false);
  const [step, setStep] = useState(-1); // -1 welcome
  const [intake, setIntake] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);

  const router = useRouter();

  const methods = useForm({ mode: "onBlur", shouldUnregister: false, defaultValues });
  const { getValues, reset, watch } = methods;

  // ECTS compute based on watched izborni
  const izborni = watch("izborni");
  const ects = useMemo(() => {
    const map = new Map([...izborniPrvi, ...izborniDrugi].map((i) => [i.id, i.ects]));
    return (izborni || []).reduce((s, id) => s + (map.get(id) || 0), 0);
  }, [izborni]);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/intakes?form=diplomski", { cache: "no-store" });
      const j = await r.json();
      setIntake(j.data || null);
    })();
  }, []);

  function onFileCheck(file) {
    if (!file) return true;
    const okType = ["image/jpeg", "image/png"].includes(file.type);
    return okType && file.size <= MAX_FILE_BYTES;
  }

  async function submit(e) {
    e.preventDefault();
    if (!intake?.id) return;

    const v = getValues();
    const ectsSum = ects;
    if (v.program === "Brodostrojarstva" && ectsSum < 13) {
      setOk({ error: "Za studij Brodostrojarstva minimalno 13 ECTS iz izbornih predmeta." });
      setStep(3);
      return;
    }

    // Validate files client-side (optional)
    const photoFile = v.photo?.[0];
    const sigFile = v.signature?.[0];
    if ((photoFile && !onFileCheck(photoFile)) || (sigFile && !onFileCheck(sigFile))) {
      setOk({ error: "Dozvoljeni su JPG/PNG do 16 MB." });
      setStep(2);
      return;
    }

    // Build FormData from RHF values (works even if inputs are unmounted)
    const fd = new FormData();
    fd.set("intake_id", intake.id);
    fd.set("form", "diplomski");

    // Simple scalar fields
    ["program", "status", "spol", "ime", "prezime", "oib", "mjesto_rodjenja", "drzava_rodjenja", "adresa", "bracno_stanje", "drzavljanstvo", "email", "mobitel", "zavrsen_preddiplomski", "ime_oca", "zanimanje_oca", "adresa_oca", "ime_majke", "zanimanje_majke", "adresa_majke"].forEach((k) =>
      fd.set(k, v[k] ?? "")
    );

    // Dates/booleans
    fd.set("datum_rodjenja", v.datum_rodjenja || "");
    fd.set("privola", v.privola ? "true" : "false");

    // Electives
    fd.set("izborni", JSON.stringify({ items: v.izborni || [], ects: ectsSum }));

    // Files
    if (photoFile) fd.set("photo", photoFile);
    if (sigFile) fd.set("signature", sigFile);

    setLoading(true);
    setOk(null);
    const res = await fetch("/api/submit", { method: "POST", body: fd });
    const j = await res.json();
    setLoading(false);
    setOk(res.ok ? j : { error: j.error || "Greška" });
    if (res.ok) {
      //hvala
      const url = `/diplomski/hvala?id=${encodeURIComponent(j.id)}${j.replaced ? "&updated=1" : ""}`;
      router.push(url);
      return;
    }
  }

  const handleStart = () => {
    setLetsGo(true);
    setStep(0);
  };

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

      {/* Middle – content */}
      <Container maxWidth={false} sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 6 } }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Welcome */}
          {step === -1 && (
            <>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                Dobrodošli na stranicu za online upis u prvu godinu diplomskih studija Pomorskog fakulteta u Splitu.
              </Typography>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>Preporučuje se korištenje modernih browsera Firefox, Chrome ili Microsoft Edge.</Typography>
              <Typography sx={{ mb: 1 }}>
                Trebat će nam Vaša slika (ona kao za osobnu iskaznicu) i potpis. Prihvaćamo <b>jpg, jpeg, png</b>.
              </Typography>
              <Typography sx={{ mb: 3 }}>Molimo unesite sve tražene podatke.</Typography>
              <Typography sx={{ mb: 3 }}>
                Ukoliko budete imali ikakvih poteškoća prilikom unosa podataka ili želite prijaviti problem u radu aplikacije za upis, pošaljite nam mail na <a href="mailto:webmaster@pfst.hr">webmaster@pfst.hr</a>
              </Typography>
              {!intake && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Upisi su trenutno zatvoreni.
                </Alert>
              )}
              <Button variant="contained" onClick={handleStart} sx={{ background: "#5e2a84", px: 3, py: 1.25 }} disabled={!intake}>
                Ok, sve mi je jasno
              </Button>
            </>
          )}

          {/* Steps */}
          {step >= 0 && (
            <FormProvider {...methods}>
              <form onSubmit={submit} noValidate>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                  Diplomski - upisi
                </Typography>
                {loading && <LinearProgress sx={{ mb: 2 }} />}
                {ok?.error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {ok.error}
                  </Alert>
                )}
                {ok?.id && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {ok.replaced ? `Ažurirano. ID: ${ok.id}` : `Zaprimljeno. ID: ${ok.id}`}{" "}
                    <Button size="small" onClick={() => navigator.clipboard.writeText(ok.id)}>
                      Kopiraj ID
                    </Button>
                  </Alert>
                )}

                {/* Unmount steps freely; RHF holds values */}
                {step === 0 && <One programs={programs} />}
                {step === 1 && <Two />}
                {step === 2 && <Three onFileCheck={onFileCheck} />}
                {step === 3 && <Four izborniPrvi={izborniPrvi} izborniDrugi={izborniDrugi} ects={ects} />}
                {step === 4 && <Five />}

                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 3 }}>
                  <Button onClick={() => setStep((s) => Math.max(-1, s - 1))}>Natrag</Button>
                  {step < steps.length - 1 ? (
                    <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} variant="contained" sx={{ background: "#5e2a84" }}>
                      Spremi i nastavi
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!watch("privola") || !intake || loading} variant="contained" sx={{ background: "#5e2a84" }}>
                      {loading ? "Slanje..." : "Podnesi prijavu"}
                    </Button>
                  )}
                </Box>
              </form>
            </FormProvider>
          )}
        </LocalizationProvider>
      </Container>

      {/* Right – stepper */}
      <Box sx={{ display: { xs: "none", md: "block" }, position: "sticky", top: 50, overflow: "auto", px: 2, py: 8 }}>{letsGo && <StepperVertical steps={steps} step={step >= 0 ? step : 0} setStep={setStep} />}</Box>
    </Box>
  );
}
