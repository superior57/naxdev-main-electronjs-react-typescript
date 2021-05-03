import * as React from 'react';
import { Skeleton } from 'antd';
import { useTrail, animated } from 'react-spring'
import AccessPointItem from '@/components/AccessPoint';
import { AccessPoint, SelectedAccessPoint } from '@/type';
import './index.less';

export type AccessPointListProps = {
  nodes: AccessPoint[];
  selectedNode: SelectedAccessPoint | undefined;
  onSelect: (id: number, type: string) => void;
  loading?: boolean;
};
const AccessPointList = ({
  nodes = [],
  selectedNode,
  onSelect,
  loading = false,
}: AccessPointListProps) => {
  const aliveNodes = nodes.filter(node => node.alive);
  const aliveNodesCmp = aliveNodes.map(node => (
    <AccessPointItem
      key={`${node.type}_${node.id}`}
      accessPoint={node}
      selected={node.id === selectedNode?.id && node.type === selectedNode?.type}
      status={node.avgMs ? (node.avgMs < 800 ? 'success' : 'warning') : 'success'}
      selectable={true}
      theme='selector'
      onSelect={onSelect}
    />
  ));

  const diedNodes = nodes.filter(node => !node.alive);
  const diedNodesCmp = diedNodes.map(node => (
    <AccessPointItem
      key={`${node.type}_${node.id}`}
      accessPoint={node}
      selected={false}
      status='default'
      selectable={false}
      theme='selector'
      onSelect={onSelect}
    />
  ));

  const aliveTrail = useTrail(aliveNodes.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: 1,
    x: 0,
    from: { opacity: 0, x: 20 },
  });

  const diedTrail = useTrail(diedNodes.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: 1,
    x: 0,
    from: { opacity: 0, x: 20 },
  });

  return (
    <section className='accessPointList'>
      {loading ? (
        <div>
          <Skeleton avatar={true} active={true} paragraph={{ rows: 3 }} />
          <Skeleton avatar={true} active={true} paragraph={{ rows: 3 }} />
          <Skeleton avatar={true} active={true} paragraph={{ rows: 3 }} />
        </div>
      ) : (
        nodes.length === 0 ? 'No access point available' : (
          <div>
            {aliveTrail.map(({ x, ...rest }, index) => (
              <animated.div
                key={`${aliveNodes[index].type}-${aliveNodes[index].id}`}
                style={{ ...rest, transform: x.interpolate((x) => `translate3d(0,${x}px,0)`) }}>
                <animated.div>{aliveNodesCmp[index]}</animated.div>
              </animated.div>
            ))}
            {diedNodes.length > 0 && <h1>Under Maintaince</h1>}
            {diedTrail.map(({ x, ...rest }, index) => (
              <animated.div
                key={`${diedNodes[index].type}-${diedNodes[index].id}`}
                style={{ ...rest, transform: x.interpolate((x) => `translate3d(0,${x}px,0)`) }}>
                <animated.div>{diedNodesCmp[index]}</animated.div>
              </animated.div>
            ))}
          </div>
        )
      )}
    </section>
  );
};

export default AccessPointList;
