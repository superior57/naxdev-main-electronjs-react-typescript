import * as React from 'react';
import { Progress, Typography, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import connectedIcon from '@/assets/icons/connected.svg';
import disconnectIcon from '@/assets/icons/disconnect.svg';
import connectErrorIcon from '@/assets/icons/connectError.svg';
import resetTrafficIcon from '@/assets/icons/resetTraffic.svg';

import './index.less';

const { Text, Title } = Typography;
export type EngineAction = 'connect' | 'connectSuccess' | 'connectFail' | 'disconnect' | 'disconnectSuccess' | 'noTraffic' | 'hover' | 'unhover' | 'reinit';
export type EngineState = 'init' | 'connecting' | 'connected' | 'connectedHoverd' | 'disconnecting' | 'error' | 'trafficOut' | 'trafficOutHorvered';
const initialState = 'init';
const reducer = (state: EngineState, action: EngineAction): EngineState => {
  switch (action) {
    case 'connect':
      return 'connecting';
    case 'connectSuccess':
      return 'connected';
    case 'connectFail':
      return 'error';
    case 'disconnect':
      return 'disconnecting';
    case 'disconnectSuccess':
      return 'init';
    case 'noTraffic':
      return 'trafficOut';
    case 'hover':
      if (state === 'connected') return 'connectedHoverd';
      if (state === 'trafficOut') return 'trafficOutHorvered';
    case 'unhover':
      if (state === 'connectedHoverd') return 'connected';
      if (state === 'trafficOutHorvered') return 'trafficOut';
    case 'reinit':
      return 'init';
    default:
      return state;
  }
};

export type ProgressProps = {
  percent: number;
  strokeStartColor: string;
  strokeEndColor: string;
};
const getProgressProps = (state: EngineState, percent: number): ProgressProps => {
  const defaultProps = {
    percent: 0,
    strokeStartColor: '',
    strokeEndColor: '',
  }
  switch (state) {
    case 'init':
      return {
        percent,
        strokeStartColor: '#00FAFF',
        strokeEndColor: '#00A4FF',
      };
    case 'connected':
    case 'connectedHoverd':
      return {
        percent,
        strokeStartColor: '#00FF36',
        strokeEndColor: '#68B100',
      }
    case 'trafficOut':
    case 'trafficOutHorvered':
      return {
        percent: 100,
        strokeStartColor: '#FF9700',
        strokeEndColor: '#FFE800',
      }
    case 'connecting':
      return {
        percent: 45,
        strokeStartColor: '#108ee9',
        strokeEndColor: '#fff'
      }
    case 'disconnecting':
      return {
        percent: 45,
        strokeStartColor: 'red',
        strokeEndColor: '#fff',
      }
    default:
      return defaultProps;
  }
};

export type EngineButtonProps = {
  used: number;
  total: number;
};
const EngineButton = ({ used, total }: EngineButtonProps) => {
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const percentage = total === 0 ? 0 : (1 - used / total) * 100;
  const remainingGb = ((total - used) / 1024 / 1024 / 1024).toFixed(1);

  React.useEffect(() => {
    if (total > 0 && used > 0 && (total - used) <= 0) {
      dispatch('noTraffic');
    } else {
      dispatch('reinit');
    }
  }, [total, used]);

  const handleConnect = () => {
    dispatch('connect');
    setTimeout(() => {
      dispatch('connectSuccess');
    }, 4000);
  };

  const handleDisconnect = () => {
    dispatch('disconnect');
    setTimeout(() => {
      dispatch('disconnectSuccess');
    }, 1000);
  }
  const isLoading = state === 'connecting' || state === 'disconnecting';
  const progressProps = getProgressProps(state, percentage);
  return (
    <div className={cn('engineButton', { 'engineButton_hover': !isLoading })}>
      <Progress
        className={cn({ 'engineButton_progressRotate': isLoading })}
        type="circle"
        percent={progressProps.percent}
        width={232}
        showInfo={false}
        strokeWidth={1}
        strokeColor={{
          '0%': progressProps.strokeStartColor,
          '100%': progressProps.strokeEndColor,
        }}
      />
      {state === 'init' && (
        <div className='engineButton_info engineButton_info_hover' onClick={handleConnect}>
          <div className='engineButton_start'>{t('Start')}</div>
          <Text className='engineButton_subinfo'>{remainingGb} Gib</Text>
          <Text className='engineButton_subinfo'>{t('Left')}</Text>
        </div>
      )}
      {state === 'connecting' && (
        <div className='engineButton_info disabled'>
          <Text className='engineButton_subinfo'>{t('Connecting...')}</Text>
        </div>
      )}
      {state === 'connected' && (
        <div className='engineButton_info engineButton_info_hover default' onMouseEnter={() => dispatch('hover')}>
          <Image src={connectedIcon} alt='connected' width={58} height={58} preview={false} />
          <Text className='engineButton_success'>{t('You are safe!')}</Text>
        </div>
      )}
      {state === 'connectedHoverd' && (
        <div className='engineButton_info engineButton_info_hover' onMouseLeave={() => dispatch('unhover')} onClick={handleDisconnect}>
          <Image src={disconnectIcon} alt='disconnect' width={58} height={58} preview={false} />
          <Text className='engineButton_disconnect'>{t('Turn off')}</Text>
        </div>
      )}
      {state === 'disconnecting' && (
        <div className='engineButton_info disabled'>
          <Image src={disconnectIcon} alt='disconnect' width={58} height={58} preview={false} />
          <Text className='engineButton_disconnect'>{t('Turn off')}</Text>
        </div>
      )}
      {state === 'error' && (
        <div className='engineButton_info engineButton_info_hover'>
          <Image src={connectErrorIcon} alt='error' width={56} height={56} preview={false} />
          <Text className='engineButton_subinfo'>{t('Error 1008')}</Text>
        </div>
      )}
      {state === 'trafficOut' && (
        <div className='engineButton_info engineButton_info_hover default' onMouseEnter={() => dispatch('hover')}>
          <Title className='engineButton_trafficOut'>{t('Out of traffic')}</Title>
          <Text className='engineButton_subinfo'>0 Gib</Text>
          <Text className='engineButton_subinfo'>{t('Available')}</Text>
        </div>
      )}
      {state === 'trafficOutHorvered' && (
        <div className='engineButton_info engineButton_info_hover' onMouseLeave={() => dispatch('unhover')}>
          <Image src={resetTrafficIcon} alt='reset traffic' width={52} height={52} preview={false} />
          <Text className='engineButton_trafficReset'>{t('Click to get traffic')}</Text>
        </div>
      )}
    </div>
  );
};

export default (props: EngineButtonProps) => {
  return (
    <React.Suspense fallback="loading">
      <EngineButton {...props} />
    </React.Suspense>
  );
};
