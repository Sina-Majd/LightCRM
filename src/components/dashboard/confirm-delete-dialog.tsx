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
      <AlertDialogContent dir="rtl" className="text-right">
        <AlertDialogHeader className="text-right space-y-2">
          <AlertDialogTitle className="text-right text-base sm:text-lg font-black text-slate-900">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right text-xs sm:text-sm text-slate-500 leading-7">
            {itemName ? (
              <>آیا از حذف <b className="text-slate-900">«{itemName}»</b> مطمئن هستید؟ این کار قابل بازگشت نیست.</>
            ) : (
              description || "این رکورد برای همیشه حذف می‌شود."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center justify-start gap-2.5 mt-3">
          <AlertDialogAction
            className="cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-black"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
          <AlertDialogCancel className="cursor-pointer">انصراف</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
