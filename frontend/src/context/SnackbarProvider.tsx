"use client";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const SNACKBAR_DURATION_MS = 5000;

interface ShowSnackbarOptions {
  message: string;
  onUndo?: () => void;
}

interface SnackbarContextValue {
  showSnackbar: (options: ShowSnackbarOptions) => void;
  closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);
export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used within <SnackbarProvider>");
  }
  return ctx;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onUndo, setOnUndo] = useState<(() => void) | undefined>(undefined);
  const [snackKey, setSnackKey] = useState(0);

  const showSnackbar = useCallback((options: ShowSnackbarOptions) => {
    setMessage(options.message);
    setOnUndo(() => options.onUndo);
    setSnackKey((k) => k + 1);
    setOpen(true);
  }, []);

  const closeSnackbar = useCallback(() => {
    setOpen(false);
  }, []);

  const handleUndo = useCallback(() => {
    onUndo?.();
    setOpen(false);
  }, [onUndo]);

  const value = useMemo(
    () => ({ showSnackbar, closeSnackbar }),
    [showSnackbar, closeSnackbar],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        key={snackKey}
        open={open}
        autoHideDuration={SNACKBAR_DURATION_MS}
        onClose={(_event, reason) => {
          if (reason === "clickaway") return;
          setOpen(false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={message}
        action={
          <>
            {onUndo && (
              <Button
                color="primary"
                variant="outlined"
                size="small"
                onClick={handleUndo}
                sx={{ mr: 1 }}
              >
                Undo
              </Button>
            )}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </SnackbarContext.Provider>
  );
}
