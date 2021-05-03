import * as React from 'react';
import cn from 'classnames';
import './index.less';

export type IconButtonProps = {
  title: string;
  icon: string | React.ReactNode;
  iconClassName?: string;
  iconWidth?: number;
  iconHeight?: number;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};
const IconButton = ({
  title,
  icon,
  iconWidth = 12,
  iconHeight = 12,
  iconClassName,
  loading = false,
  disabled = false,
  onClick,
}: IconButtonProps) => {
  const handleClick = () => {
    if (loading || disabled) return;
    if (onClick) onClick();
  };
  return (
    <div className={cn('iconButton', { 'iconButton__disabled': disabled })} onClick={handleClick}>
      <span className='iconButton__title'>{title}</span>
      {typeof icon === 'string' && (
        <img
          className={`iconButton__icon ${iconClassName}`}
          width={iconWidth}
          height={iconHeight}
          src={icon}
          alt='icon'
        />
      )}
      {React.isValidElement(icon) && (
        <span className={cn('iconButton__icon ', iconClassName, { 'iconButton__loading': loading })}>{icon}</span>
      )}
    </div>
  );
};

export default IconButton;
