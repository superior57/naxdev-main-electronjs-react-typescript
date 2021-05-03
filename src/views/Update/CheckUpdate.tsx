import * as React from 'react';
import { shell, ipcRenderer } from 'electron';
import { Image, Typography, Row, Col, Button, Layout, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { constants } from '@/constants';
import { getLatestVersion } from '@/api';
import icon from '@/assets/icons/logo.svg';
import '../../assets/styles/braft.css';
import './index.less';

const { Title, Text } = Typography;

const onQuitClick = (e: React.MouseEvent<HTMLElement>, name: string) => {
  e.preventDefault();
  ipcRenderer.send(name, `${name} the application.`);
};

function MyComponent() {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [latestVersion, setLatestVersion] = React.useState<{
    versionNum: string;
    changeLog: string;
    versionType: string;
  } | null>(null);

  React.useEffect(() => {
    setLoading(true);
    const { platform, arch } = process;
    getLatestVersion(platform, arch).then(({ data: version }) => {
      setLatestVersion(version);
      setLoading(false);
    });
  }, []);

  return (
    <Layout className="update">
      <Row justify="start" align="middle">
        <Image alt="icon" width={63} height={63} src={icon} preview={false} />
        <Title className="title" level={3}>
          {t('New Version!')}
        </Title>
      </Row>
      <section className="version">
        {loading ? (
          <>
            <Skeleton active />
            <Skeleton active />
          </>
        ) : (
          <>
            <Row justify="start">
              <Text className="font-size-xl version-number">
                {latestVersion?.versionNum}
              </Text>
              <Text className="font-size-xl released">{t('Released')}</Text>
            </Row>
            <Row justify="start">
              <Text className="font-size-l">
                {t(
                  'Upgrade to the latest version to apply the latest security updates and new features'
                )}
              </Text>
            </Row>
            <Row className="mt-m" justify="start">
              <Text className="font-size-xl released">{t('Changelog')}</Text>
            </Row>
            <Row justify="start">
              <div onClick={(e) => {
                const url = (e.target as any).getAttribute('href');
                if (url) {
                  e.preventDefault();
                  shell.openExternal(url);
                }
              }}
                   className="braft-output-content"
                   dangerouslySetInnerHTML={{
                     __html: latestVersion?.changeLog || ''
                   }}
              />
            </Row>
          </>
        )}
      </section>
      <Row justify="center">
        <Layout className="p-m">
          <Col className="col-text-center" span={24}>
            <Button
              type="link"
              className="font-size-l underline contact"
              onClick={(e) => {
                shell.openExternal(constants.CUSTOMER_SERVICE_LINK);
              }}
            >
              {t('Contact Customer Service')}
            </Button>
          </Col>
          <Col className="col-text-center" span={24}>
            <Button
              size={'large'}
              className="font-size-l btn-green mt-xs"
              block
              href={`#/updateInProgress/${latestVersion?.versionType}`}
            >
              {t('Upgrade now')}
            </Button>
          </Col>
          <Col className="col-text-center" span={24}>
            <Button
              size={'large'}
              className="font-size-l mt-m"
              block
              onClick={(e) => {
                onQuitClick(e, 'close');
              }}
            >
              {t('Quit')}
            </Button>
          </Col>
        </Layout>
      </Row>
    </Layout>
  );
}

const ConnectionError = () => {
  return (
    <>
      <React.Suspense fallback="loading">
        <MyComponent />
      </React.Suspense>
    </>
  );
};

export default ConnectionError;
