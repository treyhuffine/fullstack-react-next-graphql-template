import * as React from 'react';
import Link from 'next/link';
import companyStyle from 'style/company';
import { CompanyButtonProps } from './props';

import { CompanyButtonWrapper, CompanyIcon } from './styles';

const CompanyButton: React.FC<CompanyButtonProps> = ({ company, children }) => {
  return (
    <Link href={`/auth/${company}`}>
      <a>
        <CompanyButtonWrapper company={company}>
          <CompanyIcon className={companyStyle.icon[company]} />
          <div>{children}</div>
        </CompanyButtonWrapper>
      </a>
    </Link>
  );
};

export default CompanyButton;
