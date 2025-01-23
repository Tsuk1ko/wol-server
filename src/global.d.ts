interface Config {
  port: number;
  devices: DeviceConfig[];
}

interface DeviceConfig {
  id: string;
  mac: string;
  address?: string;
  port?: number;
  checks?: Array<CheckConfig | undefined>;
}

interface CheckConfig {
  ip?: string;
  port?: number;
  push: PushConfig;
}

interface PushConfig {
  bark?: string;
  ntfy?: {
    url: string;
    token?: string;
  };
  fetch?: {
    url: string;
    options?: any;
  };
}
