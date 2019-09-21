export enum Company {
  Facebook = 'facebook',
  Twitter = 'twitter',
  Google = 'google',
  Instagram = 'instagram',
}

type CompanyMap = Record<Company, string>;

export const color: CompanyMap = {
  [Company.Facebook]: '#3C5B96',
  [Company.Twitter]: '#59ADEB',
  [Company.Google]: '#DB4C3F',
  [Company.Instagram]: '#834ABC',
};

export const hover: CompanyMap = {
  [Company.Facebook]: '#304D8A',
  [Company.Twitter]: '#35A2F4',
  [Company.Google]: '#E0321C',
  [Company.Instagram]: '#834ABC',
};

export const icon: CompanyMap = {
  [Company.Facebook]: 'facebook',
  [Company.Twitter]: 'twitter',
  [Company.Google]: 'google',
  [Company.Instagram]: 'instagram',
};

export const name: CompanyMap = {
  [Company.Facebook]: 'Facebook',
  [Company.Twitter]: 'Twitter',
  [Company.Google]: 'Google',
  [Company.Instagram]: 'Instagram',
};

const company = {
  Company,
  color,
  hover,
  icon,
  name,
};

export default company;
