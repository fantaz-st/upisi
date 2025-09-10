"use client";
import { useFormContext, Controller } from "react-hook-form";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

export default function Five() {
  const { control } = useFormContext();
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Privola
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Na temelju točke 32. Opće uredbe o zaštiti podataka, EC 2016/679 i odredbi Zakona o provedbi Opće uredbe o zaštiti osobnih podataka („Narodne novine“ broj 42/18), svojim potpisom dajem PRIVOLU Pomorskom fakultetu u Splitu, da u svrhu ostvarivanja mojih prava iz studentskog standarda i
        službene komunikacije tijekom studiranja koristi moje osobne podatke.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Napomena: Navedeni osobni podaci koristit će se isključivo u gore navedenu svrhu u skladu sa odredbama Opće uredbe o zaštiti podataka EC 2016/679, te se u druge svrhe ne smije koristiti bez pisane privole osobe na koju se osobni podaci odnose. Daljnja obrada osobnih podataka u povijesne,
        statističke ili znanstvene svrhe neće se smatrati nepodudarnom, pod uvjetom da se poduzmu odgovarajuće zaštitne mjere.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Student ima pravo u svako doba odustati od dane privole i zatražiti prestanak daljnje obrade, na način da ispuni za to propisani obrazac, te ga dostavi voditelju obrade osobnih podataka.{" "}
      </Typography>
      <Controller name="privola" control={control} render={({ field }) => <FormControlLabel control={<Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Izjavljujem da su svi podaci točni i dajem privolu za obradu osobnih podataka." />} />
      {/* Honeypot */}
      <input type="text" name="fax" tabIndex="-1" autoComplete="off" style={{ position: "absolute", left: "-9999px" }} />
    </Box>
  );
}
