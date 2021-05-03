declare module '@ant-design/icons';

export type AccessPoint = {
  id: number;
  name: string;
  cipher: string;
  host: string;
  port: number;
  tags: string[];
  rate: string;
  type: string;
  core: string;
  status?: 'success' | 'warning' | 'default';
  selected?: boolean;
  alive: boolean;
  avgMs: number;
};

export type NodeStatus = {
  id: number;
  type: string;
  alive: boolean;
  avgMs: number;
};

export type SelectedAccessPoint = {
  id: number;
  type: string;
} | null;

export type Notice = {
  id: number;
  img_url: string;
  title: string;
  created_at: number,
  updated_at: number,
  content: string;
  read?: boolean;
};

export type ReferralCode = {
  id: number;
  code: string;
  pv: number;
  status: number;
  created_at: number;
  updated_at: number;
};

export type ReferralStat = {
  user_invited_count: number;
  total_has_confirmed_commission: number;
  confirming_cmmission: number;
  commission_rate: string;
  can_carry_cmmission: number;
};

export type Referral = {
  codes: ReferralCode[];
  stat: ReferralStat;
};

export type Settings = {
  language: string;
  skin: string;
  rememberPassword: boolean;
  autoRun: boolean;
  developerMode: boolean;
  socksPort: number;
  httpPort: number;
  forwardUdp: boolean;
  dnsMode: string;
  localDns: string[];
  chinaDns: string[];
  worldwideDns: string[];
  direct: string[];
  block: string[];
};

export type SubscribeInfo = {
  expired_at: number | null,
  d: number;
  u: number;
  transfer_enable: number;
};

export type Response = {
  code?: number;
  data?: any;
  msg?: string;
};
