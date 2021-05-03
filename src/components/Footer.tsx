import * as React from 'react';
import { Typography, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

function MyComponent() {
  const { t } = useTranslation();
  return (
    <Row>
      <Col span={12}>
        <Text type="secondary">© {t('2021 naxCloud')}</Text>
      </Col>
      <Col span={12} className="col-text-right">
        <Text type="secondary">{t('Simple·Fast·Useful')}</Text>
      </Col>
    </Row>
  );
}

const Footer = () => {
  return (
    <>
      <React.Suspense fallback="loading">
        <MyComponent />
      </React.Suspense>
    </>
  );
};

export default Footer;
