import * as  constants from './constants';
import { FlippedElementPositions, ApplyFlipArgs, OnFlipKeyUpdateArgs, FlippedElementPositionsBeforeUpdateReturnVals } from './types';


export const getAllElements = (element: HTMLElement): HTMLElement[] => {
  return Array.from(element.querySelectorAll(`[${constants.DATA_FLIP_ID}]`));
};

export const getFlippedElementPositionsBeforeUpdate = ({
element
} : {
  element: HTMLElement;
}): FlippedElementPositionsBeforeUpdateReturnVals => {
  const flippedElements = getAllElements(element);
  const flippedElementPositions: FlippedElementPositions = {};
  const parentRect = element.getBoundingClientRect();
  flippedElements.forEach((el) => {
    const id = el.dataset.flipId;
    if (id) {
      const childRect = el.getBoundingClientRect();
      flippedElementPositions[id] = {
        parent: element,
        element: el,
        childPosition: {
          top: childRect.top,
          left: childRect.left,
          right: childRect.right,
          bottom: childRect.bottom,
          x: childRect.x,
          y: childRect.y,
          width: childRect.width,
          height: childRect.height,
          relativeLeft: childRect.left - parentRect.left,
          relativeTop: childRect.top - parentRect.top
        }
      }
    }
  });

  return {
    flippedElementPositions,
    cachedFlipIds: Object.keys(flippedElementPositions)
  };
};

// so far, this function is the same as getFlippedElementPositionsBeforeUpdate
export const getFlippedPositionAfterUpdate = getFlippedElementPositionsBeforeUpdate;

export function animate(
  el: HTMLElement,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options?: number | KeyframeAnimationOptions
): Promise<void> {
  return new Promise(resolve => {
      const anim = el.animate(keyframes, options);
      anim.addEventListener("finish", () => resolve());
      anim.addEventListener("cancel", () => resolve());
  });
}

export const applyFlip = ({
  parent,
  child,
  flippedElementPositionsBeforeUpdate,
  flipCallbacks,
  flippedElementPositionsAftereUpdate,
  index,
}: ApplyFlipArgs) => {
  const containerRect = parent.getBoundingClientRect();
  const firstDatum = flippedElementPositionsBeforeUpdate[child.dataset.flipId!];
  if (!firstDatum) {
    const onAppear = flipCallbacks[child.dataset.flipId!]?.onAppear;
    if (onAppear) {
      onAppear(child, index);
    }
    return;
  }
  const lastDatum = flippedElementPositionsAftereUpdate[child.dataset.flipId!];
  if (!lastDatum) {
    const onExit = flipCallbacks[child.dataset.flipId!]?.onExit;
    if (onExit) {
      // insert back to the DOM
      if (getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative'; // make sure the position: absolute on the child work
      }

      // move the child to the original position
      child.style.position = 'absolute';
      child.style.transform = 'matrix(1, 0, 0, 1, 0, 0)'; // clear the transform
      child.style.top = `${firstDatum.childPosition.relativeTop}px`;
      child.style.left = `${firstDatum.childPosition.relativeLeft}px`;
      child.style.width = `${firstDatum.childPosition.width}px`;
      child.style.height = `${firstDatum.childPosition.height}px`;

      parent.appendChild(child);

      debugger;

      try {
        onExit(child, index, () => {
          parent.removeChild(child);
        });
      } finally {
        // remove the flipCallbacks
        delete flipCallbacks[child.dataset.flipId!];
      }
    }
    return;
  }

  const firstRelativeLeft = firstDatum.childPosition.left - containerRect.left;
  const firstRelativeTop = firstDatum.childPosition.top - containerRect.top;
  const lastRelativeLeft = lastDatum.childPosition.left - containerRect.left;
  const lastRelativeTop = lastDatum.childPosition.top - containerRect.top;

  const deltaX = firstRelativeLeft - lastRelativeLeft;
  const deltaY = firstRelativeTop - lastRelativeTop;

  const keyFrames: Keyframe[] = [];
  if (deltaX !== 0 || deltaY !== 0) {
    keyFrames.push({
      transform: `translate(${deltaX}px, ${deltaY}px)`
    });
  }

  keyFrames.push({
    transform: 'translate(0, 0)'
  });

  const options: KeyframeAnimationOptions = {
    duration: 300,
    easing: 'cubic-bezier(0.2, 0, 0, 1)'
  };

  return animate(child, keyFrames, options);
};

export const onFlipKeyUpdate = ({
  flipCallbacks,
  flippedElementPositionsBeforeUpdate,
  containerEl,
}: OnFlipKeyUpdateArgs) => {
  const flippedElements = Object.keys(flippedElementPositionsBeforeUpdate).map((id) => flippedElementPositionsBeforeUpdate[id].element);
  const flippedElementPositionsAftereUpdate = getFlippedPositionAfterUpdate({
    element: containerEl
  });

  flippedElements.forEach((child, index) => {
    applyFlip({
      parent: containerEl,
      child,
      index,
      flippedElementPositionsBeforeUpdate,
      flipCallbacks,
      flippedElementPositionsAftereUpdate: flippedElementPositionsAftereUpdate.flippedElementPositions,
    });
  });
};