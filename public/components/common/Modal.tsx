import "./Modal.scss";

import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { classSet } from "@fider/services";

interface ModalWindowProps {
  className?: string;
  isOpen: boolean;
  size?: "small" | "large" | "fluid";
  canClose?: boolean;
  center?: boolean;
  onClose: () => void;
}

interface ModalFooterProps {
  align?: "left" | "center" | "right";
  children?: React.ReactNode;
}

const ModalWindow: React.FunctionComponent<ModalWindowProps> = (props) => {
  const root = useRef<HTMLElement>(document.getElementById("root-modal"));

  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", keyDown, false);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", keyDown, false);
    }
  }, [props.isOpen]);

  const swallow = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
  };

  const keyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      // ESC
      close();
    }
  };

  const close = () => {
    if (props.canClose) {
      props.onClose();
    }
  };

  if (!props.isOpen) {
    return null;
  }

  const className = classSet({
    "c-modal-window": true,
    [`${props.className}`]: !!props.className,
    "m-center": props.center,
    [`m-${props.size}`]: true,
  });

  return ReactDOM.createPortal(
    <div aria-disabled={true} className="c-modal-dimmer" onClick={close}>
      <div className={className} onClick={swallow}>
        {props.children}
      </div>
    </div>,
    root.current!
  );
};

ModalWindow.defaultProps = {
  size: "small",
  canClose: true,
  center: true,
};

export const Modal = {
  Window: ModalWindow,
  Header: (props: { children: React.ReactNode }) => {
    return <div className="c-modal-header">{props.children}</div>;
  },
  Content: (props: { children: React.ReactNode }) => {
    return <div className="c-modal-content">{props.children}</div>;
  },
  Footer: (props: ModalFooterProps) => {
    const align = props.align || "right";
    const className = classSet({
      "c-modal-footer": true,
      [`m-${align}`]: true,
    });
    return <div className={className}>{props.children}</div>;
  },
};
