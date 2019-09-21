import * as React from 'react';
// import { useQuery } from 'react-apollo-hooks';
import Navbar from './Navbar';

const NavbarContainer: React.FC<{ isFixed?: boolean }> = props => {
  // const { data, error, loading } = useQuery<GetViewerQuery>(GET_VIEWER, { suspend: false });

  return <Navbar {...props} />;
  // return <Navbar loading={loading} error={error} data={data} {...props} />;
};

export default NavbarContainer;
