"use client";

import { Button } from "../button";
import Modal from "../modal";

interface IAlertProps {
  title: string;
  message: string;
  onConfirm: () => void;
  isOpen: boolean;
}

export default function Alert(props: IAlertProps) {
  return props.isOpen ? (
    <Modal defaultOpen={props.isOpen} onClose={props.onConfirm}>
      <div className="w-full flex flex-col gap-4">
        <p className="font-bold text-2xl text-primary">{props.title}</p>
        <p className="tet-sm">{props.message}</p>

        <Button onClick={props.onConfirm}>OK</Button>
      </div>
    </Modal>
  ) : null;
}
