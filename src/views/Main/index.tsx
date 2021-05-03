import { ipcRenderer } from 'electron';
import * as moment from 'moment';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Row,
  Col,
  Layout,
  Drawer,
} from 'antd';
import { BellOutlined, ShareAltOutlined, MessageOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import EngineButton from '@/components/EngineButton';
import AccessPointItem from '@/components/AccessPoint';
import NavigationHeader from '@/components/Header/NavigationHeader';
import Renew from '@/views/Renew';
import AccessPointSelection from '@/views/AccessPointSelection';
import useInterval from '@/hooks/useInterval';
import { constants } from '@/constants';
import {
  fetchAccessPoints,
  chooseAccessPoint,
  selectAccessPoints,
  receiveNodeStatus,
} from '@/reducers/accessPoint';
import { fetchNotices, selectNotices } from '@/reducers/notice';
import { fetchSubscribe, selectSubscribe } from '@/reducers/subscribe';
import { fetchReferral } from '@/reducers/referrral';
import { NodeStatus, AccessPoint } from '@/type';

import './index.less';

const { Text } = Typography;

const getLeftTime = (timestamp: number | null): { value: number; unit: 'Days' | 'Hours' } => {
  if (timestamp === null) {
    return {
      value: -1,
      unit: 'Days',
    }
  }
  const diff = moment.unix(timestamp).diff(moment(), 'days');
  if (diff < 0) {
    return {
      value: 0,
      unit: 'Days',
    };
  }
  if (diff === 0) {
    const hours = moment.unix(timestamp).diff(moment(), 'hours');
    return {
      value: hours,
      unit: 'Hours',
    };
  }
  return {
    value: diff,
    unit: 'Days',
  };
};

function Main(props: any) {
  const accessPoints = useSelector(selectAccessPoints);
  const notices = useSelector(selectNotices);
  const subscribe = useSelector(selectSubscribe);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [visible, setVisible] = React.useState(false);
  const [renewVisible, setRenewVisible] = React.useState(false);

  const selectedAp = accessPoints.find(node => node.selected) || accessPoints[0];
  const leftTime = subscribe ? getLeftTime(subscribe.expired_at) : {
    value: -1,
    unit: 'Days',
  };

  const renew = (leftTime.unit === 'Hours' || (leftTime.unit === 'Days' && leftTime.value <= 15 && leftTime.value >= 0)) ? 
    'heavy' : (leftTime.unit === 'Days' && leftTime.value <= 30 && leftTime.value >= 0) ? 'light' : '';

  const used = subscribe ? (subscribe.d + subscribe.u) : 0;
  const total = subscribe ? subscribe.transfer_enable : 0;

  const hasNewNotice = !!notices.find(notice => !notice.read);

  React.useEffect(() => {
    (dispatch(fetchAccessPoints()) as any).then((response: AccessPoint[]) => {
      // fire first ping
      ipcRenderer.send('ping', response);
    });
    dispatch(fetchNotices());
    dispatch(fetchSubscribe());
    dispatch(fetchReferral());
  }, [dispatch]);

  React.useEffect(() => {
    let id: any;
    if (renew === 'light') {
      setRenewVisible(true);
      id = setInterval(() => {
        setRenewVisible(true);
      }, constants.RENEW_LIGHT_INTERVAL);
    } else if (renew === 'heavy') {
      setRenewVisible(true);
      id = setInterval(() => {
        setRenewVisible(true);
      }, constants.RENEW_HEAVY_INTERVAL);
    }
    return () => clearInterval(id);
  }, [renew]);

  // choose next alive node if current node is die
  React.useEffect(() => {
    if (selectedAp && !selectedAp.alive) {
      const alivePoint = accessPoints.find(node => node.alive);
      if (alivePoint) {
        dispatch(chooseAccessPoint(alivePoint.id, alivePoint.type));
      }
    }
  }, [selectedAp, accessPoints]);

  // ping interval
  useInterval(() => {
    if (accessPoints && accessPoints.length > 0) {
      ipcRenderer.send('ping', accessPoints);
    }
  }, constants.PING_INTERVAL);

  // subscribe interval
  useInterval(() => {
    dispatch(fetchSubscribe());
  }, constants.SUBSCRIBE_INTERVAL);

  // common refresh interval
  useInterval(() => {
    dispatch(fetchNotices());
    dispatch(fetchReferral())
  }, constants.REFRESH_INTERVAL);

  const { id, type } = selectedAp || {};
  React.useEffect(() => {
    const pong = (_: any, status: NodeStatus[]) => {
      dispatch(receiveNodeStatus(status));
    };
    ipcRenderer.on('pong', pong);
    return () => {
      ipcRenderer.removeListener('pong', pong);
    };
  }, [id, type, dispatch]);

  const handleAccessPointClick = () => {
    setVisible(true);
  };

  const handleAccessPointSelect = (id: number, type: string) => {
    setTimeout(() => setVisible(false), 200);
    dispatch(chooseAccessPoint(id, type));
  };

  const handleReferral = () => {
    props.history.push('/referral');
  };

  const handleNews = () => {
    props.history.push('/news');
  };
  return (
    <Layout className={cn('main', { blur: visible || renewVisible })}>
      <Row justify='space-between' align='middle'>
        <span className='main__title'>{t('naxCloud data relay')}</span>
        <div className='main__icons'>
          <ShareAltOutlined className='main__icon' onClick={handleReferral} />
          <MessageOutlined className='main__icon' />
          <div className='main__notification' onClick={handleNews}>
            <BellOutlined className='main__icon' />
            {hasNewNotice && <span className='main__dot' />}
          </div>
        </div>
      </Row>
      <Row justify='space-between' align='middle'>
        <Col span={6}>
          <Row align='bottom'>
            <span className={cn('main__days', {'main__days-renew-light': renew === 'light', 'main__days-renew-heavy': renew === 'heavy'})}>
              {leftTime.value === -1 ? '♾️' : leftTime.value}
            </span>
            <Text>{`${t(leftTime.unit)} ${t('left')}`}</Text>
          </Row>
        </Col>
        <Col span={18}>
          <div className='main__divider' />
        </Col>
      </Row>
      <Row className='main__engine' justify='center'>
        <EngineButton used={used} total={total} />
      </Row>
      <Row className='main__access' justify='center' onClick={handleAccessPointClick}>
        <AccessPointItem
          status={(selectedAp && selectedAp.alive) ? (selectedAp.avgMs < 800 ? 'success' : 'warning') : 'default'}
          accessPoint={selectedAp}
          theme='button'
        />
      </Row>
      <Drawer
        title={<NavigationHeader title={t('Access point selection')} onBack={() => setVisible(false)} />}
        placement='bottom'
        closable={false}
        visible={visible}
        height='100vh'
      >
        <AccessPointSelection onSelect={handleAccessPointSelect} />
      </Drawer>
      <Drawer
        placement='bottom'
        closable={false}
        visible={renewVisible}
        height='100vh'
      >
        <Renew renew={leftTime} onBack={() => setRenewVisible(false)} />
      </Drawer>
    </Layout>
  );
}

export default (props: any) => {
  return (
    <React.Suspense fallback="loading">
      <Main {...props} />
    </React.Suspense>
  );
};
