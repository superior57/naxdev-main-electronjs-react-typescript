import * as React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  Carousel,
  Pagination,
} from 'antd';
import * as moment from 'moment';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import NavigationHeader from '@/components/Header/NavigationHeader';
import {
  fetchNotices,
  selectNotices,
  markNoticeAsRead,
} from '@/reducers/notice';

import './index.less';

const CAROUSEL_SIZE = 3;
const PAGE_SIZE = 4;
function News(props: any) {
  const news = useSelector(selectNotices);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = React.useState(1);
  const ref = React.useRef(null);

  React.useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch])

  const topNews = news.slice(0, CAROUSEL_SIZE);
  const pageNews = news.slice((currentPage - 1) * PAGE_SIZE, (currentPage - 1) * PAGE_SIZE + PAGE_SIZE);

  const carousels = topNews.map(news => (
    <div key={news.title} className='news__carousel-item'>
      <img src={news.img_url} />
      <span onClick={() => handleReadNews(news.id)}>{news.title}</span>
    </div>
  ));

  const list = pageNews.map(item => (
    <div className={cn('news__item', { 'news__item-read': item.read })} key={item.id} onClick={() => handleReadNews(item.id)}>
      <p className='news__item-title'>{item.title}</p>
      <p className='news__item-date'>Date : {moment.unix(item.created_at).format('YYYY/M/D')}</p>
    </div>
  ));

  const handleReadNews = async (id: number) => {
    dispatch(markNoticeAsRead(id));
    const notice = news.find(item => item.id === id);
    props.history.push({
      pathname: '/notice',
      state: { notice },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    props.history.goBack();
  };

  const handlePrev = () => {
    if (ref && ref.current) {
      (ref.current as any).prev();
    }
  };

  const handleNext = () => {
    if (ref && ref.current) {
      (ref.current as any).next();
    }
  }
  return (
    <div className='news'>
      <NavigationHeader className='news__header' title='Latest News' onBack={handleBack} />
      <section className='news__content'>
        <LeftOutlined className='news__carousel-left-arrow' onClick={handlePrev} />
        <RightOutlined className='news__carousel-right-arrow' onClick={handleNext} />
        <Carousel ref={ref} className='news__carousel' autoplay={true} dots={true} dotPosition='top'>
          {carousels}
        </Carousel>
        <div className='news__list'>
          {list}
        </div>
        <div className='news__pagination'>
          <Pagination simple={true} pageSize={PAGE_SIZE} total={news.length} onChange={handlePageChange} />
        </div>
      </section>
    </div>
  );
};

export default (props: any) => {
  return (
    <React.Suspense fallback="loading">
      <News {...props} />
    </React.Suspense>
  );
};
