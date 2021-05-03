import { ipcRenderer } from 'electron';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Divider,
  Select,
} from 'antd';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { flatten, uniq } from 'lodash';
import AccessPointList from '@/components/AccessPointList';
import IconButton from '@/components/IconButton';
import { refreshAccessPoints, selectAccessPoints, selectLoading, chooseAccessPoint } from '@/reducers/accessPoint';

import './index.less';

const { Option } = Select;
const COUNTDOWN_SECONDS = 60;
export type AccessPointSelectionProps = {
  onSelect?: (id: number, type: string) => void;
}
function AccessPointSelection({ onSelect }: AccessPointSelectionProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const nodes = useSelector(selectAccessPoints);
  const loading = useSelector(selectLoading);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [countdown, setCountdown] = React.useState(COUNTDOWN_SECONDS);
  const [countdownInterval, setCountdownInterval] = React.useState<NodeJS.Timeout>();
  const [refreshing, setRefreshing] = React.useState(false);
  const selectedNode = nodes.find(node => node.selected);

  React.useEffect(() => {
    if (countdown <= 0) {
      setRefreshing(false);
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    }
  }, [countdown, countdownInterval]);

  const handleSelect = async (id: number, type: string) => {
    dispatch(chooseAccessPoint(id, type));
    if (onSelect) {
      onSelect(id, type);
    }
  };

  const handleTagsChange = (value: string[]) => {
    setSelectedTags(value);
  };

  const handleRefresh = async () => {
    await dispatch(refreshAccessPoints());
    setRefreshing(true);
    setCountdown(COUNTDOWN_SECONDS);
    const id = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    setCountdownInterval(id);
    setSelectedTags([]);
  };

  const tags = uniq(flatten(nodes.map(item => item.tags)))
    .sort((a, b) => a.localeCompare(b));
  const options = tags.map(tag => <Option key={tag} value={tag}>{tag}</Option>);
  const filteredNodes = nodes.filter(item => item.tags.filter(tag => selectedTags.includes(tag)).length > 0);
  return (
    <section className='accessPointSelection'>
      <Row justify='space-between' align='middle' wrap={false}>
        <Col className='accessPointSelection__search'>
          <Select
            disabled={loading}
            mode="multiple"
            style={{ width: '204px' }}
            placeholder={t('Please select filter tags')}
            maxTagCount={'responsive' as const}
            value={selectedTags}
            onChange={handleTagsChange}
          >
            {options}
          </Select>
          <SearchOutlined className='accessPointSelection__searchIcon' />
        </Col>
        <Col>
          <IconButton
            title={refreshing ? `${countdown}s` : t('Refresh')}
            icon={<RedoOutlined />}
            iconClassName='accessPointSelection__btn'
            loading={loading}
            disabled={loading || refreshing}
            onClick={handleRefresh}
          />
        </Col>
      </Row>
      <Divider />
      <div className='accessPointSelection__list'>
        <AccessPointList
          selectedNode={selectedNode}
          nodes={selectedTags.length === 0 ? nodes : filteredNodes}
          onSelect={handleSelect}
        />
      </div>
    </section>
  );
};

export default (props: AccessPointSelectionProps) => {
  return (
    <React.Suspense fallback="loading">
      <AccessPointSelection {...props} />
    </React.Suspense>
  );
};
