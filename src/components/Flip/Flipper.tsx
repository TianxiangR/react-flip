import React, { Component } from 'react'
import { applyFlip, getAllElements, getFlippedElementPositionsBeforeUpdate, onFlipKeyUpdate } from './flipHelpers';
import { FlipCallbacks, FlippedElementPositions, FlippedElementPositionsBeforeUpdateReturnVals } from './types';
import FlipContext from './FlipContext';

export interface FlipperProps {
  flipKey: string;
  children?: React.ReactNode;
  element?: string;
  className?: string;
}

interface FlipperState {

}

interface FlipperSnapshot {
  flippedElementPositionsBeforeUpdate: FlippedElementPositionsBeforeUpdateReturnVals;
}

export default class Flipper extends Component<FlipperProps, FlipperState, FlipperSnapshot> {
  static defaultProps: FlipperProps = {
    flipKey: '',
    element: 'div'
  }

  private containerEl: HTMLDivElement | null = null;
  private flipCallbacks: FlipCallbacks = {};

  getSnapshotBeforeUpdate(prevProps: Readonly<FlipperProps>): FlipperSnapshot | null {
    if (prevProps.flipKey !== this.props.flipKey && this.containerEl) {
      return {
        flippedElementPositionsBeforeUpdate: getFlippedElementPositionsBeforeUpdate({
          element: this.containerEl
        })
      }
    }
    return null;
  }

  componentDidUpdate(_prevProps: Readonly<FlipperProps>, _prevState: Readonly<FlipperState>, snapshot?: FlipperSnapshot | undefined): void {
      if (snapshot && this.containerEl) {
        onFlipKeyUpdate({
          flipCallbacks: this.flipCallbacks,
          flippedElementPositionsBeforeUpdate: snapshot.flippedElementPositionsBeforeUpdate.flippedElementPositions,
          containerEl: this.containerEl,
          cachedFlipIds: snapshot.flippedElementPositionsBeforeUpdate.cachedFlipIds
        });
      }
  }

  render() {
    const { element: Element, children } = this.props;
    return (
      <FlipContext.Provider value={this.flipCallbacks}>
        {/* @ts-ignore */}
        <Element ref={(el) => this.containerEl = el} className={this.props.className}>
          {children}
        </Element>
      </FlipContext.Provider>
    )
  }
}
