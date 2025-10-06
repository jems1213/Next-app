"use client";
import React, { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { useAuth } from "../context/auth";

export default function GlobalSignOutConfirm() {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onOpen() { setOpen(true); }
    window.addEventListener('open-signout-confirm', onOpen as EventListener);
    return () => window.removeEventListener('open-signout-confirm', onOpen as EventListener);
  }, []);

  return (
    <ConfirmDialog
      open={open}
      title="Sign out"
      message="Are you sure you want to sign out?"
      confirmLabel="Sign out"
      cancelLabel="Cancel"
      onCancel={() => setOpen(false)}
      onConfirm={() => { setOpen(false); signOut(); }}
    />
  );
}
