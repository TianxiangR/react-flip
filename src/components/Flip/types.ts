export type FlippedElementPositions = {
  [key: string]: DOMRect;
}

export interface ApplyFlipArgs {
  container: HTMLElement;
  child: HTMLElement;
  flippedElementPositionsBeforeUpdate: FlippedElementPositions;
  flipCallbacks: FlipCallbacks;
  flippedElementPositionsAftereUpdate: FlippedElementPositions;
  index: number;
}

export interface CallbackFlippedProps {
  onAppear?: (element: HTMLElement, index: number) => void;
  onExit?: (element: HTMLElement, index: number, removeElement: () => void) => void;
}

export interface FlipCallbacks {
  [key: string]: CallbackFlippedProps;
}

export interface OnFlipKeyUpdateArgs {
  flipCallbacks: FlipCallbacks;
  flippedElementPositionsBeforeUpdate: FlippedElementPositions;
  containerEl: HTMLElement;
}