import * as React from 'react';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import { ipcRenderer } from 'electron';
import { Row, Col, Space, Button } from 'antd';
import './index.less';

const onIconClick = (e: React.MouseEvent<HTMLElement>, name: string) => {
  e.preventDefault();
  ipcRenderer.send(name, `${name} the application.`);
};

const PublicHeader = () => {
  return (
    <div className='publicHeader'>
      <div className="ant-drag-handle"/>
      <Row justify="end">
        <Col className='publicHeader__btns'>
          <Space size={8}>
            <Button
              icon={<MinusOutlined />}
              type="text"
              size={'small'}
              shape={'circle'}
              className="header-btn-secondary publicHeader__btn"
              onClick={(e) => {
                onIconClick(e, `minimize`);
              }}
            />
            <Button
              icon={<CloseOutlined />}
              type="text"
              size={'small'}
              shape={'circle'}
              className="header-btn-red publicHeader__btn"
              onClick={(e) => {
                onIconClick(e, 'close');
              }}
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default PublicHeader;
