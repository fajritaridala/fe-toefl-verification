import * as fs from 'fs';
import * as os from 'os';

const getLocalIp = (): string => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (ifaceList) {
      for (const iface of ifaceList) {
        // Cari IPv4 dan pastikan bukan localhost (127.0.0.1)
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  return '127.0.0.1';
};

const ip = getLocalIp();

const envContent = `NEXT_PUBLIC_CERTIFICATE_LINK="http://${ip}:3000/verification/result"
NEXT_PUBLIC_RPC_URL='http://${ip}:8545'
NEXT_PUBLIC_IP_PROVIDER="http://${ip}:8545"
`;

try {
  fs.writeFileSync('.env.local', envContent);
  console.log(`✅ Berhasil! .env.local diperbarui dengan IP: ${ip}`);
} catch (error) {
  console.error('❌ Gagal menulis file .env.local:', error);
}
