import * as React from 'react';
import { Empty } from 'antd';
import * as moment from 'moment';
import NavigationHeader from '@/components/Header/NavigationHeader';
import { Notice } from '@/type';

import '../../assets/styles/braft.css';
import './index.less';

function Notice(props: any) {
  const { notice } = props.location.state || {};
  const handleBack = () => {
    props.history.goBack();
  };
  return (
    <div className='notice'>
      <NavigationHeader className='notice__header' title={notice?.title || 'notice'} onBack={handleBack} />
      <section>
        {notice ? (
          <>
            <p className='notice__date'>{moment.unix(notice?.created_at).format('YYYY/M/D')}</p>
            <div
              className="notice__content braft-output-content"
              dangerouslySetInnerHTML={{
                __html: notice?.content || ''
              }}
            />
          </>
        ) : <Empty />}
      </section>
    </div>
  );
};

export default Notice;
