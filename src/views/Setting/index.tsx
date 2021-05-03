import { ipcRenderer } from 'electron';
import { remote } from 'electron';
import * as React from 'react';
import {
  Select,
  Switch,
  Form,
  Button,
  Input,
  Transfer,
  message,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { constants } from '@/constants';
import { getSettings, saveSettings } from '@/api/index';
import NavigationHeader from '@/components/Header/NavigationHeader';

import './index.less';

const { Option } = Select;

const localDNSs = ['Localhost', '114 Public', 'Alibaba', 'DNSPod', 'Google', 'CloudFlare', 'OpenDNS', 'Microsoft']
  .map(dns => ({
    key: dns,
    title: dns,
  }));
const chinaDNSs = ['114 Public', 'Alibaba', 'DNSPod'].map(dns => ({
  key: dns,
  title: dns,
}));
const worldwideDNSs = ['Alibaba', 'DNSPod', 'Google', 'CloudFlare', 'OpenDNS', 'Microsoft'].map(dns => ({
  key: dns,
  title: dns,
}));
const portValidator = (_: any, value: any) => {
  if (value < 0 || value > 65535) {
    return Promise.reject(new Error('Please input valid port'));
  }
  return Promise.resolve();
};
function Setting(props: any) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const currentVersion = process.env.npm_package_version || remote.app.getVersion();

  React.useEffect(() => {
    getSettings().then(response => {
      form.setFieldsValue(response);
    });
  }, []);

  const handleCancel = () => {
    props.history.goBack();
  };

  const handleApply = async () => {
    const payload = await form.validateFields();
    await saveSettings(payload);
    message.success('Settings Applied');
    ipcRenderer.send('changeLanguage', payload.language);
    props.history.goBack();
  };

  const handleBack = () => {
    props.history.goBack();
  };
  return (
    <section className='setting'>
      <NavigationHeader className='setting__header' title='Settings' onBack={handleBack} />
      <div className='setting__body'>
        <Form
          form={form}
          name="setting"
          initialValues={constants.DEFAULT_SETTINGS}
        >
          <section className='setting__section'>
            <div className='setting__title'>
              <h1>General setting</h1>
              <div className='setting__divider' />
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Language</span>
              <Form.Item
                name="language"
              >
                <Select style={{ width: 130 }}>
                  <Option value="ENG_US">English</Option>
                  <Option value="ZH_CN">Chinese</Option>
                </Select>
              </Form.Item>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Skin Options</span>
              <Form.Item
                name="skin"
              >
                <Select style={{ width: 130 }}>
                  <Option value="Default">Default</Option>
                  <Option value="Light">Light</Option>
                </Select>
              </Form.Item>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Remember password</span>
              <Form.Item
                name="rememberPassword"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Auto run</span>
              <Form.Item
                name="autoRun"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Developer mode</span>
              <Form.Item
                name="developerMode"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>
          </section>
          <section className='setting__section'>
            <div className='setting__title'>
              <h1>Core setting</h1>
              <div className='setting__divider' />
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Socks port</span>
              <Form.Item
                name="socksPort"
                validateTrigger='onBlur'
                rules={[
                  { required: true, message: "Please input socks port" },
                  { validator: portValidator },
                ]}
              >
                <Input type='number' className="setting__input" />
              </Form.Item>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Http port</span>
              <Form.Item
                name="httpPort"
                validateTrigger='onBlur'
                rules={[
                  { required: true, message: "Please input http port" },
                  { validator: portValidator },
                ]}
              >
                <Input type='number' className="setting__input" />
              </Form.Item>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Forward UDP</span>
              <Form.Item
                name="forwardUdp"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>
          </section>
          <section className='setting__section'>
            <div className='setting__title'>
              <h1>DNS setting</h1>
              <div className='setting__divider' />
            </div>
            <div className='setting__line'>
              <span className='setting__label'>DNS mode</span>
              <Form.Item
                name="dnsMode"
              >
                <Select style={{ width: 130 }}>
                  <Option value="DNS">DNS</Option>
                  <Option value="DOH(DNS over HTTPS)">DOH(DNS over HTTPS)</Option>
                </Select>
              </Form.Item>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Local DNS</span>
            </div>
            <div className='setting__line'>
              <Form.Item
                name="localDns"
                valuePropName="targetKeys"
                rules={[
                  { required: true, message: "Please select local DNS" },
                ]}
              >
                <Transfer
                  dataSource={localDNSs}
                  render={item => item.title}
                />
              </Form.Item>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>China DNS</span>
            </div>
            <div className='setting__line'>
              <Form.Item
                name="chinaDns"
                valuePropName="targetKeys"
                rules={[
                  { required: true, message: "Please select China DNS" },
                ]}
              >
                <Transfer
                  dataSource={chinaDNSs}
                  render={item => item.title}
                />
              </Form.Item>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Worldwide DNS</span>
            </div>
            <div className='setting__line'>
              <Form.Item
                name="worldwideDns"
                valuePropName="targetKeys"
                rules={[
                  { required: true, message: "Please select Worldwide DNS" },
                ]}
              >
                <Transfer
                  dataSource={worldwideDNSs}
                  render={item => item.title}
                />
              </Form.Item>
            </div>
          </section>

          <section className='setting__section'>
            <div className='setting__title'>
              <h1>Routing setting</h1>
              <div className='setting__divider' />
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Direct</span>
            </div>
            <div className='setting__line'>
              <Form.Item
                name="direct"
                valuePropName="targetKeys"
              >
                <Transfer
                  dataSource={localDNSs}
                  showSearch
                  render={item => item.title}
                />
              </Form.Item>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Block</span>
            </div>
            <div className='setting__line'>
              <Form.Item
                name="block"
                valuePropName="targetKeys"
              >
                <Transfer
                  dataSource={localDNSs}
                  showSearch
                  render={item => item.title}
                />
              </Form.Item>
            </div>
          </section>

          <section className='setting__section'>
            <div className='setting__title'>
              <h1>Version</h1>
              <div className='setting__divider' />
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Core</span>
              <span className='setting__value'>1.1.2</span>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>APP</span>
              <span className='setting__value'>{currentVersion}</span>
            </div>
            <div className='setting__line'>
              <span className='setting__label'>Release date</span>
              <span className='setting__value'>2021/01/01</span>
            </div>
          </section>
        </Form>
      </div>
      <div className='setting__btns'>
        <Button className='setting__btn' onClick={handleApply}>Apply</Button>
        <Button className='setting__btn' onClick={handleCancel}>Cancel</Button>
      </div>
    </section>
  );
}

export default (props: any) => {
  return (
    <React.Suspense fallback="loading">
      <Setting {...props} />
    </React.Suspense>
  );
};
