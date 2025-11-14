import React from 'react';
import '../../styles/ui/container.scss';

type ContainerProps = React.PropsWithChildren<{
  padding?: string;
  className?: string;
}>;

const Container: React.FC<ContainerProps> = ({ children, padding, className }) => {

  const conatinerStyle = {
    '--container-padding': padding,
  } as React.CSSProperties;

  const conatinerClassName = `container ${className || ''}`.trim();

  return (
    <div className={conatinerClassName} style={conatinerStyle}>
      {children}
    </div>
  );
};

export default Container;