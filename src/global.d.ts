interface Config {
  port: number;
  devices: DeviceConfig[];
}

interface DeviceConfig {
  id: string;
  mac: string;
  address?: string;
  port?: number;
  check?: CheckConfig;
}

interface CheckConfig {
  ip?: string;
  port?: number;
  push?: PushConfig;
}

interface PushConfig {
  bark?: string;
  fetch?: {
    url: string;
    options?: any;
  };
}
