import * as React from 'react';
import { LeftOutlined } from '@ant-design/icons';

import './index.less';

export type NavigationHeaderProps = {
  title: string;
  className?: string;
  onBack: () => void;
}
export default ({ title, className = '', onBack }: NavigationHeaderProps) => {
  return (
    <header className={`navigationHeader ${className}`}>
      <LeftOutlined className='navigationHeader__back navigationHeader__btn' onClick={onBack} />
      <div className='navigationHeader__title'>
        {title}
      </div>
    </header>
  );
};
