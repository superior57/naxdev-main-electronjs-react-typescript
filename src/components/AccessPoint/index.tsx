import * as React from 'react';
import { Row, Col, Image, Typography, Badge, Tag, Skeleton } from 'antd';
import { DownOutlined, CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { AccessPoint } from '@/type';

import './index.less';

const { Text } = Typography;

export type AccessPointProps = {
  accessPoint: AccessPoint;
  status: 'success' | 'warning' | 'default',
  selectable?: boolean;
  selected?: boolean;
  loading?: boolean;
  theme?: 'button' | 'selector';
  onSelect?: (id: number, type: string) => void;
  [propName: string]: any;
};
const AccessPoint = ({
  accessPoint,
  status,
  selected = false,
  selectable = false,
  loading = false,
  theme = 'button',
  onSelect,
  ...rest
}: AccessPointProps) => {
  if (!accessPoint || loading) {
    return (
      <Row className='accessPoint'>
        <Skeleton
          active={true}
          avatar={{ shape: 'circle' }}
          paragraph={{ rows: 1 }}
        />
      </Row>
    );
  }

  const { id, type, name, tags, rate } = accessPoint;
  const tagsRef = React.useRef(null);
  const [tagsWidth, setTagsWidth] = React.useState(0);
  const [selecting, setSelecting] = React.useState(false);
  const [flag, setFlag] = React.useState('');
  const [first = '', second = ''] = name.split(']');
  const avatar = first.slice(1);
  const acName = second.slice(1);

  const disable = theme === 'selector' && !selectable;

  // set flag icon dynamicly
  React.useEffect(() => {
    import(`../../assets/icons/flags/${avatar.toLowerCase()}.svg`)
      .then(icon => setFlag(icon.default));
  }, [avatar]);

  // reset state whenever id or type changed
  React.useEffect(() => {
    setTagsWidth((tagsRef.current as any).offsetWidth);
  }, [id, type])

  const tagList = tags.map(tag => <Tag className={cn({ 'accessPoint__tag-disable': disable })} key={tag}>{tag}</Tag>);
  const handleClick = async () => {
    if (selectable && onSelect) {
      // await the select finish if it is async function
      setSelecting(true);
      await onSelect(id, type);
      setSelecting(false);
    }
  };

  const needScroll = tagsWidth > 190;
  return (
    <Row
      {...rest}
      className={cn('accessPoint', { [theme]: true, disable, 'selected': selected })}
      justify="space-between"
      align='middle'
      wrap={false}
      onClick={handleClick}
    >
      <Col>
        <Row align='middle' wrap={false}>
          {flag ? (
            <Image src={flag} alt='flag' width={40} height={40} preview={false} />
          ) : (
            <Skeleton.Avatar style={{ width: 40 }} shape='circle' />
          )}
          <Col className='accessPoint_content'>
            <Row align='middle' className='accessPoint_title'>
              <Badge status={status} />
              <Text className={cn('accessPoint_name', { 'accessPoint_name-disable': disable })}>{acName}</Text>
            </Row>
            <div ref={tagsRef} className={cn('accessPoint__tags', { 'accessPoint__scroll': needScroll })}>
              {tagList}
            </div>
          </Col>
        </Row>
      </Col>
      <Col className='accessPoint__icon'>
        {theme === 'selector' && selectable && selecting && <LoadingOutlined style={{ color: '#49FE00' }} />}
        {theme === 'selector' && selectable && !selecting && selected && <CheckOutlined style={{ color: '#49FE00' }} />}
        {theme === 'button' && <DownOutlined />}
      </Col>
      {theme === 'selector' && (
        <div className='accessPoint_speed'>
          {rate}x
        </div>
      )}
    </Row>
  );
};

export default AccessPoint;
