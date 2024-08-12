import React, { Children, cloneElement, ReactElement, useContext, useEffect, useLayoutEffect } from 'react'
import * as constants from './constants';
import { CallbackFlippedProps } from './types';
import FlipContext from './FlipContext';

export interface FlipperProps extends CallbackFlippedProps {
  children: React.ReactNode;
  flipId?: string;
}

function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

function Flipped({ children, flipId }: FlipperProps) {
  let child = children

  if (!isFunction(child)) {
    try {
      child = Children.only(children)
    } catch (e) {
      throw new Error('Each Flipped component must wrap a single child')
    }
  }


  const dataAttributes: DOMStringMap = {
    [constants.DATA_FLIP_ID]: flipId,
  }

  if (isFunction(child)) {
    return (child as Function)(dataAttributes)
  }
  return cloneElement(child as ReactElement<any>, dataAttributes)
}

export default function FlippedWithContext(props: FlipperProps) {
  const {
    children, 
    flipId,
    onAppear,
    onExit,
  } = props;
  const flipContext = useContext(FlipContext);

  useLayoutEffect(() => {
    if (flipId) {
      flipContext[flipId] = {
        onAppear,
        onExit,
      };
    }
    return () => {
      if (flipId) {
        delete flipContext[flipId];
      }
    };
  }, [flipContext, flipId, onAppear, onExit]);

  if (!children) {
    return null;
  }

  return (
    <Flipped {...props} />
  );
}