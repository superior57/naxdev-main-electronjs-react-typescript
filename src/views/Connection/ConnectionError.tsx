import * as React from 'react';
import { shell } from 'electron';
import {
  Image,
  Typography,
  Row,
  Col,
  Space,
  Button,
  Layout,
} from 'antd';

import icon from '@/assets/icons/logo.svg';
import error1005 from '@/assets/icons/error1005.svg';
import { useTranslation } from 'react-i18next';
import { constants } from '@/constants';

const { Title, Text } = Typography;

function MyComponent() {
  const { t } = useTranslation();
  return (
    <Layout>
      <Row className="plr-m">
        <Space size={'middle'}>
          <Col>
            <Image
              alt="icon"
              width={53}
              height={53}
              src={icon}
              preview={false}
            />
          </Col>
          <Col>
            <Title level={4}>{t('Error 1005')}</Title>
          </Col>
        </Space>
      </Row>
      <Row className="p-m" justify="center">
        <Col>
          <Image
            alt="icon"
            width={110}
            height={130}
            src={error1005}
            preview={false}
          />
        </Col>
      </Row>
      <Row justify="center">
        <Col className="col-text-center pm-pl" span={24}>
          <Title level={3}>{t('Unable to connect!')}</Title>
          <Text className="font-size-l">
            {t(
              'You must be connected to the Internet to use the software If you cant solve the issue by yourself, please contact our online customer service'
            )}
          </Text>
        </Col>
      </Row>
      <Row justify="center">
        <Layout className="p-m">
          <Col className="col-text-center" span={24}>
            <Button
              type="link"
              className="font-size-l underline"
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
              className="font-size-l mt-xs"
              block
              href="#/"
            >
              {t('Try again')}
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
