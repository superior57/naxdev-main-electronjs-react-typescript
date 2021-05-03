import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Select,
  Input,
  Divider,
  Button,
  Tooltip,
  message,
} from 'antd';
import { DownloadOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { toDataURL } from 'qrcode';
import NavigationHeader from '@/components/Header/NavigationHeader';
import { useTranslation } from 'react-i18next';
import { Referral } from '@/type';
import { selectReferral } from '@/reducers/referrral';
import { fetchReferral, createReferral } from '@/reducers/referrral';
import referralIcon from '@/assets/icons/referral.svg';
import starsIcon from '@/assets/icons/stars.svg';

import './index.less';

const { Option } = Select;
const { Search } = Input;
const baseUrl = 'https://v2test.cf/#/register?code=';
function Referral(props: any) {
  const referral = useSelector(selectReferral);
  const dispatch = useDispatch();
  const [selectedCode, setSelectedCode] = React.useState('');
  const [qrcode, setQrcode] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const { t } = useTranslation();
  const qrcodeUrl = `${baseUrl}${selectedCode}`;

  const hasCodes = referral && referral.codes.length > 0;

  React.useEffect(() => {
    toDataURL(qrcodeUrl, {
      errorCorrectionLevel: 'H',
      margin: 1.2,
    }).then(data => {
      setQrcode(data);
    });
  }, [selectedCode]);

  React.useEffect(() => {
    dispatch(fetchReferral());
  }, [dispatch])

  React.useEffect(() => {
    if (referral && referral.codes.length > 0 && selectedCode === '') {
      setSelectedCode(referral.codes[0].code);
    }
  }, [referral, selectedCode]);

  const codeOptions = (referral?.codes || []).map(code => (
    <Option key={code.code} value={code.code}>{code.code}</Option>
  ));

  const handleBack = () => {
    props.history.goBack();
  };

  const handleSelect = (value: string) => {
    setSelectedCode(value);
    setCopied(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrcode;
    link.setAttribute("download", selectedCode);
    link.click();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(qrcodeUrl);
    setCopied(true);
  };

  const handleCreate = async () => {
    setCreating(true);
    const success = await (dispatch(createReferral()) as any);
    setCreating(false);
    if (success) {
      message.success('create success');
    } else {
      message.error('create failed');
    }
  };
  return (
    <div className='referral'>
      <NavigationHeader className='referral__header' title={hasCodes ? 'Referral system' : 'Promotion system'} onBack={handleBack} />
      <section className='referral__content'>
        <div className='referral__desc'>Share those information with your friends. Get cash back for every order</div>
        <div className='referral__data'>
          <div className='referral__data-item'>
            <span className='referral__data-value'>{referral?.stat?.user_invited_count}</span>
            <span className='referral__data-desc'>Registered</span>
          </div>
          <div className='referral__data-item'>
            <div className='referral__data-value'>
              <span>{referral?.stat?.can_carry_cmmission.toFixed(2)}</span>
              <span className='referral__data-unit'>$</span>
            </div>
            <span className='referral__data-desc'>Available Balance</span>
          </div>
          <div className='referral__data-item'>
            <div className='referral__data-value' >
              <span>{referral?.stat?.commission_rate.replace('%', '')}</span>
              <span className='referral__data-unit'>%</span>
            </div>
            <span className='referral__data-desc'>Per Order</span>
          </div>
        </div>
        <Divider />
        {hasCodes ? (
          <>
            <div className='referral__invitation'>
              <span>Invitation code:</span>
              <div className='referral__invitation-actions'>
                <Select style={{ width: 130 }} value={selectedCode} onChange={handleSelect}>
                  {codeOptions}
                </Select>
                <Tooltip title='New invitation code'>
                  <Button
                    className='referral__create-btn'
                    shape='circle'
                    type='text'
                    size='small'
                    icon={<PlusOutlined />}
                    loading={creating}
                    onClick={handleCreate}
                  />
                </Tooltip>
              </div>
            </div>
            <div className='referral__qrcode-wrapper'>
              <div className='referral__qrcode'>
                {qrcode && <img src={qrcode} width={108} height={108} />}
                <div className='referral__download' onClick={handleDownload}>
                  <span>Click to download</span>
                  <DownloadOutlined />
                </div>
              </div>
            </div>
            <div className='referral__desc'>The url of this referral code：</div>
            <Search
              placeholder="input referral link"
              value={qrcodeUrl}
              enterButton={copied ? (<CheckOutlined className='referral__check' />) : 'Copy'}
              spellCheck={false}
              onSearch={handleCopy}
            />
            <div className="referral__withdraw">
              <img src={referralIcon} width={16} height={16} />
              <span>withdraw</span>
            </div>
          </>
        ) : (
          <>
            <div className='referral__getStarted'>Let's get started!</div>
            <div className='referral__desc'>Your "invitation code" has been exhausted or never created, You should create them.</div>
            <img className='referral__stars' src={starsIcon} alt='stars' />
            <Button className='referral__btn' size='large' loading={creating} onClick={handleCreate}>Create</Button>
          </>
        )}
      </section>
      <footer>
        <span>© {t('2021 naxCloud')}</span>
      </footer>
    </div>
  );
};

export default (props: any) => {
  return (
    <React.Suspense fallback="loading">
      <Referral {...props} />
    </React.Suspense>
  );
};
