import * as React from 'react';

import { Wrapper, Content } from './styles';

interface Props {
  hoverable?: boolean;
}

const Card: React.FC<Props> = ({ children, hoverable }) => {
  return (
    <Wrapper hoverable={hoverable}>
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default Card;
