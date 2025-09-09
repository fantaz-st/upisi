"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

function createEmotionCache() {
  const cache = createCache({ key: "css", prepend: true });
  cache.compat = true;
  return cache;
}

const theme = createTheme({ palette: { mode: "light" }, shape: { borderRadius: 12 } });

export default function ThemeRegistry({ children }) {
  const [cache] = React.useState(() => createEmotionCache());
  useServerInsertedHTML(() => <style data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`} dangerouslySetInnerHTML={{ __html: Object.values(cache.inserted).join(" ") }} />);
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
