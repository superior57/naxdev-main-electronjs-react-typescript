import { shell } from 'electron';
import * as React from 'react';
import { Button } from 'antd';
import { constants } from '@/constants';

import './index.less';

export type RenewProps = {
  renew: {
    value: number;
    unit: 'Days' | 'Hours',
  },
  onBack: () => void;
}
function Renew(props: RenewProps) {
  const handleRenew = () => {
    shell.openExternal(constants.RENEW_URL);
  };
  return (
    <section className='renew'>
      <h1>续费提醒</h1>
      <p>您的产品有效期仅剩余<span className='renew__warning'>{props.renew.value}</span><span>{props.renew.unit}</span>，为避免您的服务遭到中断，请及时续费。</p>
      <div className='renew__btns'>
        
      <Button className='renew__btn' size='large' onClick={handleRenew}>续费</Button>
        <Button className='renew__btn' size='large' onClick={props.onBack}>稍后提醒</Button>
      </div>
    </section>
  );
};

export default (props: any) => {
  return (
    <React.Suspense fallback="loading">
      <Renew {...props} />
    </React.Suspense>
  );
};
