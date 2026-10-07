"use client";

import React from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  itemName?: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({ open, onOpenChange, title, description, itemName, confirmLabel = "حذف", onConfirm }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {itemName ? (
              <>آیا از حذف <b className="text-slate-900">«{itemName}»</b> مطمئن هستید؟ این کار قابل بازگشت نیست.</>
            ) : (
              description || "این رکورد برای همیشه حذف می‌شود."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>انصراف</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
