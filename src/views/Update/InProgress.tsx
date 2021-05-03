import * as React from 'react';
import { ipcRenderer } from 'electron';
import { Redirect } from 'react-router-dom';
import { Image, Typography, Row, Col, Layout, Progress } from 'antd';
import icon from '@/assets/icons/logo.svg';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const description = 'Checking for updates';

function MyComponent(props: any) {
  const { t } = useTranslation();
  const [percentage, setPercentage] = React.useState(10);
  const [errorRedirect, setErrorRedirect] = React.useState(false);

  React.useEffect(() => {
    if (props.versionType === 'minor') {
      ipcRenderer.send('checkForPartUpdate');

      ipcRenderer.on('PartUpdating', (event, message) => {
        if (message.error) setErrorRedirect(true);
        if (message.percent) setPercentage(message.percent);
      });
    } else {
      ipcRenderer.send('upgrade');
      ipcRenderer.on('upgrading', (event, message) => {
        if (message.error) setErrorRedirect(true);
        setPercentage(message.percent);
      });
    }
  }, []);

  return errorRedirect ? (
    <Redirect to='/connectionError' />
  ) : (
    <Layout className="mt-l">
      <Row justify="center">
        <Col span={24} className="col-text-center">
          <Image alt="icon" width={63} height={63} src={icon} preview={false} />
          <Title level={2}>{t('naxCloud')}</Title>
        </Col>
      </Row>
      <Row justify="center" className="mt-xl">
        <Col className="col-text-center p-l" span={24}>
          <Progress
            percent={percentage}
            showInfo={false}
            status="active"
            strokeWidth={2}
          />
          <Layout className="mt-s">
            <Text className="font-size-xl">{t(description)}</Text>
          </Layout>
        </Col>
      </Row>
    </Layout>);
}

const ConnectionError = (props: any) => {
  return (
    <>
      <React.Suspense fallback="loading">
        <MyComponent versionType={props.match.params.versionType} />
      </React.Suspense>
    </>
  );
};

export default ConnectionError;
