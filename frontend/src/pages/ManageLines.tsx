import { useEffect } from "react";
import ManageLinesMachines from "./ManageLinesMachines";

export function ManageLines() {
  useEffect(() => {
    document.title = "Manage Lines | Ops-log";
  }, []);
  // Just render the lines section from ManageLinesMachines
  return <ManageLinesMachines section="lines" />;
}

export function ManageMachines() {
  // Just render the machines section from ManageLinesMachines
  return <ManageLinesMachines section="machines" />;
}
