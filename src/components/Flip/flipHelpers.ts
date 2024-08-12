import * as  constants from './constants';
import { FlippedElementPositions, ApplyFlipArgs, OnFlipKeyUpdateArgs } from './types';


export const getAllElements = (element: HTMLElement): HTMLElement[] => {
  return Array.from(element.querySelectorAll(`[${constants.DATA_FLIP_ID}]`));
};

export const getFlippedElementPositionsBeforeUpdate = ({
element} : {
  element: HTMLElement;
}): FlippedElementPositions => {
  const flippedElements = getAllElements(element);
  const flippedElementPositions: FlippedElementPositions = {};
  flippedElements.forEach((el) => {
    const id = el.dataset.flipId;
    if (id) {
      const rect = el.getBoundingClientRect();
      flippedElementPositions[id] = rect;
    }
  });

  return flippedElementPositions;
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
  container,
  child,
  flippedElementPositionsBeforeUpdate,
  flipCallbacks,
  flippedElementPositionsAftereUpdate,
  index
}: ApplyFlipArgs) => {
  const containerRect = container.getBoundingClientRect();
  const firstRect = flippedElementPositionsBeforeUpdate[child.dataset.flipId!];
  console.log('flipCallbacks', flipCallbacks);
  console.log('firstRect', firstRect);
  if (!firstRect) {
    console.log('flipId', child.dataset.flipId!);
    console.log('callbacks', flipCallbacks[child.dataset.flipId!]);
    const onAppear = flipCallbacks[child.dataset.flipId!]?.onAppear;
    console.log('onAppear', onAppear);
    if (onAppear) {
      console.log('onAppear', child, index);
      onAppear(child, index);
    }
    return;
  }
  const lastRect = flippedElementPositionsAftereUpdate[child.dataset.flipId!];
  if (!lastRect) {
    const onExit = flipCallbacks[child.dataset.flipId!]?.onExit;
    if (onExit) {
      onExit(child, index, () => {
        child.remove();
      });
    }
    return;
  }

  const firstRelativeLeft = firstRect.left - containerRect.left;
  const firstRelativeTop = firstRect.top - containerRect.top;
  const lastRelativeLeft = lastRect.left - containerRect.left;
  const lastRelativeTop = lastRect.top - containerRect.top;

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
  const flippedElements = getAllElements(containerEl);
  const flippedElementPositionsAftereUpdate = getFlippedPositionAfterUpdate({
    element: containerEl
  });

  flippedElements.forEach((child, index) => {
    applyFlip({
      container: containerEl,
      child,
      index,
      flippedElementPositionsBeforeUpdate,
      flipCallbacks,
      flippedElementPositionsAftereUpdate,
    });
  });
};