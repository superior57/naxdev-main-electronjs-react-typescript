import * as React from 'react';
import { remote } from 'electron';
import { Image, Row, Col, Space, Spin } from 'antd';
import { Redirect } from 'react-router-dom';
import icon from '@/assets/icons/logo.svg';
import { getLatestVersion } from '@/api';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface States {
  redirect?: boolean;
  path?: string;
}

export default class SplashScreen extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: false,
      path: '',
    };
  }

  async checkForUpdates() {
    try {
      const { platform, arch } = process;
      const response = await getLatestVersion(platform, arch);
      const currVsn = process.env.npm_package_version || remote.app.getVersion();
      const needUpdate = response && response.data && currVsn !== response.data.versionNum;

      this.setState({
        redirect: true,
        path: needUpdate ? '/checkUpdate' : '/userLogin',
      });
    } catch (e) {
      console.error(e);
      this.setState({ redirect: true, path: '/connectionError' });
    }
  }

  componentDidMount() {
    this.checkForUpdates();
  }

  render() {
    const { redirect, path } = this.state;

    return redirect ? (
      <Redirect to={`${path}`} />
    ) : (
      <>
        <Row className="full-height" justify="center" align="middle">
          <Space direction="vertical" size={'middle'}>
            <Col>
              <Image
                alt="icon"
                height={62}
                width={94}
                src={icon}
                preview={false}
              />
            </Col>
            <Col className="col-text-center">
              <Spin size="large" />
            </Col>
          </Space>
        </Row>
      </>
    );
  }
}
