export interface FlippedElementRect extends Omit<DOMRect, 'toJSON'> {
  relativeLeft: number;
  relativeTop: number;
}

export interface FlippedElementPositionDatumBeforeUpdate {
  element: HTMLElement;
  parent: HTMLElement;
  childPosition: FlippedElementRect;
}

export type FlippedElementPositions = {
  [key: string]: FlippedElementPositionDatumBeforeUpdate;
}


export interface ApplyFlipArgs {
  parent: HTMLElement;
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
  cachedFlipIds: string[];
}

export interface FlippedElementPositionsBeforeUpdateReturnVals {
  flippedElementPositions: FlippedElementPositions;
  cachedFlipIds: string[];
}