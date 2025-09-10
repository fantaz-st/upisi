"use client";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

export default function Four({ izborniPrvi, izborniDrugi, ects }) {
  const { control } = useFormContext();
  const program = useWatch({ control, name: "program" });

  return (
    <Controller
      name="izborni"
      control={control}
      render={({ field }) => {
        const sel = field.value || [];
        const toggle = (id) => {
          const next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id];
          field.onChange(next);
        };
        return (
          <>
            <Typography sx={{ mb: 1 }}>
              Odaberite izborne predmete za prvi i drugi semestar. Zbroj njihovih bodova za studij <b>BS</b> mora biti minimalno <b>13</b>!
            </Typography>

            <Typography sx={{ mt: 1, mb: 1 }}>
              <b>Prvi semestar:</b>
            </Typography>
            <Box sx={{ display: "grid", gap: 1, mb: 2 }}>
              {izborniPrvi.map((i) => (
                <FormControlLabel key={i.id} control={<Checkbox checked={sel.includes(i.id)} onChange={() => toggle(i.id)} />} label={`${i.label}, broj bodova: ${i.ects}`} />
              ))}
            </Box>

            <Typography sx={{ mt: 1, mb: 1 }}>
              <b>Drugi semestar:</b>
            </Typography>
            <Box sx={{ display: "grid", gap: 1, mb: 2 }}>
              {izborniDrugi.map((i) => (
                <FormControlLabel key={i.id} control={<Checkbox checked={sel.includes(i.id)} onChange={() => toggle(i.id)} />} label={`${i.label}, broj bodova: ${i.ects}`} />
              ))}
            </Box>

            <Typography sx={{ fontWeight: 700 }}>
              Trenutni zbroj ECTS: {ects}
              {program === "Brodostrojarstva" ? " / minimalno 13" : ""}
            </Typography>
          </>
        );
      }}
    />
  );
}
