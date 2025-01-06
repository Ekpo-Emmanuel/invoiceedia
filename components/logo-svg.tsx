import React from 'react';

interface Props extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    className?: string;
}  

const LogoSvg: React.FC<Props> = (props) => {
  return (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="logo-35"
    width="24"
    height="24"
    viewBox="0 0 50 39"
    {...props}
  >
    <path
      d="M16.5 2h21.08L22.083 24.973H1z"
      className="ccompli1"
    ></path>
    <path
      d="M17.422 27.102 11.42 36h22.082L49 13.027H32.702l-9.496 14.075z"
      className="ccustom"
    ></path>
  </svg>   
  )
};

export default LogoSvg;