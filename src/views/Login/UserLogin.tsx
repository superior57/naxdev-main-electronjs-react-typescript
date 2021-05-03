import * as React from 'react';
import {
  Image,
  Typography,
  Row,
  Col,
  Space,
  Form,
  Input,
  Button,
  Checkbox,
  Layout,
  message,
} from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import AddonInput from '@/components/AddonInput';
import { login, getSettings, saveSettings, getCredentials, saveCredentials } from '@/api/index';
import { Settings } from '@/type';

import icon from '@/assets/icons/logo.svg';
import hiddenIcon from '@/assets/icons/hidden.svg';
import visibleIcon from '@/assets/icons/visible.svg';

const { Title, Text } = Typography;

function MyComponent(props: any) {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [settings, setSettings] = React.useState<Settings>();
  const [form] = Form.useForm();

  const initForm = async () => {
    const response = await getSettings();
    form.setFieldsValue({
      remember: response.rememberPassword,
    });
    if (response.rememberPassword) {
      const credentials = await getCredentials();
      form.setFieldsValue({
        email: credentials.email,
        password: credentials.password,
      });
    }
    setSettings(response);
  };

  React.useEffect(() => {
    initForm();
  }, []);


  const onFinish = async (values: any) => {
    setLoading(true);
    const success = await login(values.email, values.password);
    if (success) {
      if (settings) {
        await saveSettings({
          ...settings,
          rememberPassword: values.remember,
        });
      }
      if (values.remember) {
        await saveCredentials(values.email, values.password);
      }
      props.history.push('/main');
    } else {
      message.error(t('Login failed'));
      form.setFieldsValue({ email: '', password: '' });
    }
    setLoading(false);
  };

  return (
    <Layout className="mt-l">
      <Row justify="center">
        <Col span={24} className="col-text-center">
          <Image alt="icon" width={63} height={63} src={icon} preview={false} />
          <Title level={2}>{t('naxCloud')}</Title>
        </Col>
      </Row>
      <Form
        form={form}
        name="login"
        size="large"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Row justify="center" className="p-l">
          <Col span={24}>
            <Form.Item
              name="email"
              validateTrigger='onBlur'
              rules={[
                { type: 'email', message: t('Please Enter a valid Email!') },
                { required: true, message: t('Please input your Email!')}
              ]}
            >
              <Input addonBefore={<MailOutlined />} placeholder={t('Email')} spellCheck={false} />
            </Form.Item>
            <Form.Item
              name="password"
              className="pt-s"
              validateTrigger='onBlur'
              rules={[
                { required: true, message: t('Please input your Password!') },
              ]}
            >
              <AddonInput
                type={passwordVisible ? '' : 'password'}
                beforeIcon={<LockOutlined />}
                placeholder={t('Password')}
                afterIcon={passwordVisible ? visibleIcon : hiddenIcon}
                afterIconWidth={22}
                afterIconHeight={22}
                onAfterIconClick={() => setPasswordVisible(prev => !prev)}
              />
            </Form.Item>
            <Form.Item className="col-text-left">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>
                  <Text className="font-size-l">{t('Remember me')}</Text>
                </Checkbox>
              </Form.Item>
              <Button
                className="float-right font-size-l"
                size={'small'}
                type="link"
              >
                {t('Forgot the password?')}
              </Button>
            </Form.Item>
          </Col>
          <Layout className="pt-s">
            <Col span={24} className="col-text-center">
              <Form.Item>
                <Button
                  loading={loading}
                  htmlType="submit"
                  size={'large'}
                  className="font-size-l"
                  block
                >
                  {t('Log in')}
                </Button>
              </Form.Item>
            </Col>
            <Col span={24} className="col-text-center">
              <Space size={'small'}>
                <Text className="font-size-l">{t('No account?')}</Text>
                <Button
                  href="#/noSubscription"
                  className="font-size-l"
                  size={'small'}
                  type="link"
                >
                  {t('Register!')}
                </Button>
              </Space>
            </Col>
          </Layout>
        </Row>
      </Form>
    </Layout>
  );
}

const UserLogin = (props: any) => {
  return (
    <>
      <React.Suspense fallback="loading">
        <MyComponent {...props} />
      </React.Suspense>
    </>
  );
};

export default UserLogin;
