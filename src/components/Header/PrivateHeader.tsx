import { ipcRenderer } from 'electron';
import * as React from 'react';
import { Row, Col, Button, Image, Typography } from 'antd';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/icons/logo.svg';
import tool from '@/assets/icons/tool.svg';
import './index.less';

const { Text } = Typography;

const onIconClick = (e: React.MouseEvent<HTMLElement>, name: string) => {
  e.preventDefault();
  ipcRenderer.send(name, `${name} the application.`);
};

const Header = (props: any) => {
  const { t } = useTranslation();
  const hanldeSetting = () => {
    props.history.push('/setting');
  };

  return (
    <div className='privateHeader'>
      <div className="ant-drag-handle"/>
      <Row justify="space-between">
        <Col>
          <Row align="middle">
            <Image
              alt="logo"
              width={24}
              height={24}
              src={logo}
              preview={false}
            />
            <Text style={{ marginLeft: '8px' }}>{t('naxCloud')}</Text>
          </Row>
        </Col>
        <Col className='publicHeader__btns'>
          <Row align="middle">
            <Image
              className='privateHeader__btn'
              alt="tool"
              width={20}
              height={20}
              src={tool}
              preview={false}
              onClick={hanldeSetting}
            />
            <Button
              style={{ marginLeft: '10px' }}
              icon={<MinusOutlined />}
              type="text"
              size={'small'}
              shape={'circle'}
              className="header-btn-secondary privateHeader__btn"
              onClick={(e) => {
                onIconClick(e, `minimize`);
              }}
            />
            <Button
              style={{ marginLeft: '8px' }}
              icon={<CloseOutlined />}
              type="text"
              size={'small'}
              shape={'circle'}
              className="header-btn-red privateHeader__btn"
              onClick={(e) => {
                onIconClick(e, 'close');
              }}
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const PrivateHeader = (props: any) => {
  return (
    <>
      <React.Suspense fallback="loading">
        <Header {...props} />
      </React.Suspense>
    </>
  );
};

export default PrivateHeader;
