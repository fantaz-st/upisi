"use client";
import { Box, Button } from "@mui/material";

export default function StepperVertical({ steps, step, setStep }) {
  return (
    <Box
      sx={{
        position: { md: "sticky" },
        top: 0,
        alignSelf: "start",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        gap: 1.25,
        py: 8,
        pr: 2,
      }}
    >
      {steps.map((s, i) => {
        const active = step === i;
        const done = step > i;
        return (
          <Button
            key={s.key}
            onClick={() => setStep(i)}
            variant={active ? "contained" : "outlined"}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              borderRadius: 2,
              px: 1.25,
              py: 1,
              ...(active ? { background: "#5e2a84" } : {}),
              borderColor: done ? "#5e2a84" : undefined,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                mr: 1,
                display: "grid",
                placeItems: "center",
                background: active ? "rgba(255,255,255,.2)" : "#eee",
                color: active ? "#fff" : "#5e2a84",
                fontWeight: 700,
              }}
            >
              {i + 1}
            </Box>
            {s.label}
          </Button>
        );
      })}
    </Box>
  );
}
