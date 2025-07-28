import { requireNativeView } from 'expo';
import * as React from 'react';

import { MediaControlsViewProps } from './MediaControls.types';

const NativeView: React.ComponentType<MediaControlsViewProps> =
  requireNativeView('MediaControls');

export default function MediaControlsView(props: MediaControlsViewProps) {
  return <NativeView {...props} />;
}
