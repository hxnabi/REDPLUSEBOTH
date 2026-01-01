import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  targetRole: "donor" | "organizer" | null;
  onConfirm: () => void;
}

const RoleSwitchDialog: React.FC<Props> = ({ open, setOpen, targetRole, onConfirm }) => {
  const title = targetRole === "organizer" ? "Switch to Organizer" : "Switch to Donor";
  const description =
    targetRole === "organizer"
      ? "You're logged in as a donor. To access the organizer area you must logout first. Do you want to logout and continue to organizer login?"
      : "You're logged in as an organizer. To access donor features you must logout first. Do you want to logout and continue to donor login?";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoleSwitchDialog;
