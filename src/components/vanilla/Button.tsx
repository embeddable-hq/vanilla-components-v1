import React from 'react';
import Spinner from './Spinner';

type Props = {
  buttonLabel?: string;
  showSpinner?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
};

export default function Button({ buttonLabel, showSpinner, disabled, onClick, icon }: Props) {
  return (
    <button
      disabled={disabled}
      className={`
        border
        disabled:cursor-not-allowed
        disabled:opacity-[0.6]
        flex
        gap-[8px]
        items-center
        justify-center
        bg-controls-buttons-active-background
        border-controls-buttons-active-border
        h-controls-buttons-height
        hover:bg-controls-buttons-hovered-background
        hover:border-controls-buttons-hovered-border
        hover:text-controls-buttons-hovered-font-color
        pressed:bg-controls-buttons-pressed
        pressed:border-controls-buttons-pressed-border
        pressed:text-controls-buttons-pressed-font-color
        px-controls-buttons-padding-x
        py-controls-buttons-padding-y
        rounded-controls-buttons-radius
        text-controls-buttons-active-font-color
        text-embeddable
      `}
      onClick={onClick}
      type="button"
    >
      {showSpinner ? <Spinner show className={'relative'} size={'20'} /> : icon}
      {buttonLabel}
    </button>
  );
}
