import * as React from 'react';
import { Viewer } from '@appname/utils/auth';

interface Props {
  viewer: Viewer;
}

export const ViewerContext = React.createContext({ id: '' });

const ViewerProvider: React.FC<Props> = ({ viewer = { id: '' }, children }) => {
  return <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>;
};

export default ViewerProvider;
