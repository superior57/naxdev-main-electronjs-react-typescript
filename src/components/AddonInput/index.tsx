import * as React from 'react';
import { Input } from 'antd';
import './index.less';

export type AddonInputProps = {
  beforeIcon?: React.ReactNode;
  afterIcon?: string | React.ReactNode;
  afterIconWidth?: number;
  afterIconHeight?: number;
  afterIconAlt?: string;
  afterIconClassName?: string;
  onAfterIconClick?: () => void;
  [propName: string]: any;
};

const AddonInput = ({
  beforeIcon,
  afterIcon,
  afterIconWidth = 20,
  afterIconHeight = 20,
  afterIconAlt = 'icon',
  afterIconClassName = '',
  onAfterIconClick,
  ...rest
}: AddonInputProps) => {
  return (
    <div className='addonInput'>
      <Input {...rest} addonBefore={beforeIcon} spellCheck={false} />
      {(afterIcon && (typeof afterIcon === 'string')) && (
        <img
          className='addonInput_afterIcon'
          width={afterIconWidth}
          height={afterIconHeight}
          src={afterIcon}
          alt={afterIconAlt}
          onClick={onAfterIconClick}
        />
      )}
      {afterIcon && React.isValidElement(afterIcon) && (
        <span className={`addonInput_afterIcon ${afterIconClassName}`}>{afterIcon}</span>
      )}
    </div>
  );
};

export default AddonInput;
